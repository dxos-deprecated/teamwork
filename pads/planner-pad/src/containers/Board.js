//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { keyToBuffer } from '@dxos/crypto';
import { ObjectModel } from '@dxos/object-model';
import { useItems, useParty } from '@dxos/react-client';

import { CardDetailsDialog, LabelsDialog } from '../components';
import { labelsContext } from '../hooks';
import { positionCompare, getLastPosition, CARD_TYPE, LIST_TYPE } from '../model';
import { defaultLabelNames, PLANNER_LABELS, labelColorLookup } from '../model/labels';
import DraggableLists from './DraggableLists';

const useStyles = makeStyles(theme => {
  return {
    containerRoot: {
      overflowY: 'hidden',
      overflowX: 'scroll',
      height: '100%'
    },

    spinner: {
      position: 'absolute',
      right: 0,
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2)
    }
  };
});

export const Board = ({ topic, embedded, item }) => {
  const classes = useStyles();
  const party = useParty(keyToBuffer(topic));
  const lists = useItems({ partyKey: party.key, parent: item.id, type: LIST_TYPE });
  const cards = useItems({ partyKey: party.key, parent: item.id, type: CARD_TYPE });

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
      type: LIST_TYPE,
      parent: item.id,
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
      type: CARD_TYPE,
      parent: item.id,
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
          handleMoveList={handleMoveList}
          handleMoveCard={handleMoveCard}
          lists={visibleLists}
          boardId={item.id}
          isDragDisabled={isDragDisabled}
          onDragDisabled={() => setIsDragDisabled(true)}
          getCardsForList={getCardsForList}
          embedded={embedded}
          onOpenCard={cardId => setSelectedCard(cards.find(c => c.id === cardId))}
          handleAddCard={handleAddCard}
          handleUpdateList={handleUpdateListOrCard}
          handleAddList={handleAddList}
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
