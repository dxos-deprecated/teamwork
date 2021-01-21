//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { keyToBuffer } from '@dxos/crypto';
import { ObjectModel } from '@dxos/object-model';
import { useItems, useParty } from '@dxos/react-client';

import { CardDetailsDialog, LabelsDialog } from '../components';
import { labelsContext } from '../hooks';
import { useSelection } from '../hooks/useSelection';
import {
  defaultLabelNames,
  labelColorLookup,
  positionCompare,
  getLastPosition,
  PLANNER_TYPE_CARD,
  PLANNER_TYPE_LIST,
  PLANNER_TYPE_BOARD,
  PLANNER_LABELS
} from '../model';
import DraggableLists from './DraggableLists';

export const itemSelector = selection => {
  return selection.items;
};

const useStyles = makeStyles(theme => {
  return {
    containerRoot: {
      overflowY: 'hidden',
      overflowX: 'scroll',
      height: '100%' // TODO(burdon): flex?
    },

    spinner: {
      position: 'absolute',
      right: 0,
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2)
    }
  };
});

export const Board = ({ topic, embedded, itemId }) => {
  const classes = useStyles();
  const party = useParty(keyToBuffer(topic));
  const [item] = useItems({ partyKey: party.key, type: PLANNER_TYPE_BOARD, id: itemId });
  const lists = useItems({ partyKey: party.key, parent: itemId, type: PLANNER_TYPE_LIST });
  const cards = useItems({ partyKey: party.key, parent: itemId, type: PLANNER_TYPE_CARD });

  const graphLists = useSelection(
    party.database.select({ partyKey: party.key, parent: itemId, type: PLANNER_TYPE_LIST }),
    selection => selection.items
  );
  const graphCards = useSelection(
    party.database.select({ partyKey: party.key, parent: itemId, type: PLANNER_TYPE_CARD }),
    selection => selection.items
  );

  console.log({ graphCards, graphLists });

  const [selectedCard, setSelectedCard] = useState(undefined);
  const [showArchived, setShowArchived] = useState(false);
  const [isDragDisabled, setIsDragDisabled] = useState(false);
  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [filterByLabel, setFilterByLabel] = useState(undefined);

  const visibleLists = lists
    .filter(c => showArchived || !c.model.getProperty('deleted'))
    .sort(positionCompare);

  const visibleCards = cards
    .filter(c => showArchived || !c.model.getProperty('deleted'))
    .filter(c => !filterByLabel || (c.model.getProperty('labels') && c.model.getProperty('labels')[filterByLabel]));

  const getCardsForList = listId => visibleCards
    .filter(card => card.model.getProperty('listId') === listId)
    .sort(positionCompare);

  const handleAddList = async () => {
    await party.database.createItem({
      model: ObjectModel,
      type: PLANNER_TYPE_LIST,
      parent: itemId,
      props: { title: 'New List', position: getLastPosition(lists) }
    });
  };

  // const handleUpdateListOrCard = (listId) => (properties) => listsModel.updateItem(listId, properties);
  const handleUpdateListOrCard = (listId) => async (prop, value) => {
    const listOrCard = lists.find(l => l.id === listId) || cards.find(l => l.id === listId);
    await listOrCard.model.setProperty(prop, value);
  };

  const handleAddCard = async (title, listId) => {
    const cardsInList = getCardsForList(listId);
    await party.database.createItem({
      model: ObjectModel,
      type: PLANNER_TYPE_CARD,
      parent: itemId,
      props: { title, position: getLastPosition(cardsInList), listId }
    });
  };

  const handleToggleArchive = async () => {
    assert(selectedCard);
    await selectedCard.model.setProperty('deleted', !selectedCard.model.getProperty('deleted'));
    setSelectedCard(undefined);
  };

  const handleMoveList = async (id, { position }) => {
    const list = lists.find(l => l.id === id);
    (position !== undefined) && await list.model.setProperty('position', position);
    setIsDragDisabled(false);
  };

  const handleMoveCard = async (id, { position, listId }) => {
    const card = cards.find(l => l.id === id);
    (position !== undefined) && await card.model.setProperty('position', position);
    (listId !== undefined) && await card.model.setProperty('listId', listId);
    setIsDragDisabled(false);
  };

  if (!item) {
    return null;
  }

  return (
    <labelsContext.Provider
      value={{
        filterByLabel,
        names: item.model.getProperty('labelnames') ?? defaultLabelNames,
        onFilterByLabel: (label) => setFilterByLabel(label),
        onOpenLabelsDialog: () => setLabelsDialogOpen(true),
        labels: PLANNER_LABELS,
        colorLookup: labelColorLookup
      }}
    >
      <div className={classes.containerRoot}>
        { isDragDisabled && <CircularProgress className={classes.spinner} />}
        <DraggableLists
          onMoveList={handleMoveList}
          onMoveCard={handleMoveCard}
          lists={visibleLists}
          boardId={itemId}
          isDragDisabled={isDragDisabled}
          onDragDisabled={() => setIsDragDisabled(true)}
          getCardsForList={getCardsForList}
          embedded={embedded}
          onOpenCard={cardId => setSelectedCard(cards.find(c => c.id === cardId))}
          onAddCard={handleAddCard}
          onUpdateList={handleUpdateListOrCard}
          onAddList={handleAddList}
          showArchived={showArchived}
          onToggleShowArchived={() => setShowArchived(prev => !prev)}
        />
        <CardDetailsDialog
          open={!!selectedCard}
          onClose={() => setSelectedCard(undefined)}
          onToggleArchive={handleToggleArchive}
          card={selectedCard}
          onCardUpdate={handleUpdateListOrCard(selectedCard?.id)}
        />
        <LabelsDialog
          open={labelsDialogOpen}
          onClose={() => setLabelsDialogOpen(false)}
          onUpdate={(labelnames) => item.model.setProperty('labelnames', labelnames)}
        />
      </div>
    </labelsContext.Provider>
  );
};
