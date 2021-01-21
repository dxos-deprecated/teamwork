//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useEffect, useMemo, useState } from 'react';

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
  PLANNER_LABELS,
  LINK_LIST_CARD
} from '../model';
import DraggableLists from './DraggableLists';

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

  const listsSelectionFilter = useMemo(() => [{ partyKey: party.key, parent: itemId, type: PLANNER_TYPE_LIST }], []);
  const lists = useSelection(party.database, listsSelectionFilter);

  const cardsSelectionFilter = useMemo(() => [{ partyKey: party.key, parent: itemId, type: PLANNER_TYPE_CARD }], []);
  const cards = useSelection(party.database, cardsSelectionFilter);

  const [selectedCard, setSelectedCard] = useState(undefined);
  const [showArchived, setShowArchived] = useState(false);
  const [isDragDisabled, setIsDragDisabled] = useState(false);
  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [filterByLabel, setFilterByLabel] = useState(undefined);

  const visibleLists = lists
    .filter(c => showArchived || !c.model.getProperty('deleted'))
    .sort(positionCompare);

  const getCardsForList = listId => getCardsLinkedToList(lists.find(list => list.id === listId));

  const getCardsLinkedToList = list => list.links
    .filter(l => !l.model.getProperty('deleted'))
    .map(link => link.target)
    .filter(c => showArchived || !c.model.getProperty('deleted'))
    .filter(c => !filterByLabel || (c.model.getProperty('labels' ?? []).includes(filterByLabel)))
    .sort(positionCompare);

  const handleAddList = async () => {
    await party.database.createItem({
      model: ObjectModel,
      type: PLANNER_TYPE_LIST,
      parent: itemId,
      props: { title: 'New List', position: getLastPosition(lists) }
    });
  };

  const handleUpdateListOrCard = (id) => async (prop, value) => {
    const listOrCard = lists.find(l => l.id === id) || cards.find(l => l.id === id);
    await listOrCard.model.setProperty(prop, value);
  };

  const handleToggleCardLabel = (id) => async (toggledLabel) => {
    const card = cards.find(l => l.id === id);
    const labels = card.model.getProperty('labels') ?? [];
    const labelExists = labels.includes(toggledLabel);
    if (!labelExists) {
      card.model.addToSet('labels', toggledLabel);
    } else {
      card.model.removeFromSet('labels', toggledLabel);
    }
  };

  const handleAddCard = async (title, list) => {
    const cardsInList = getCardsLinkedToList(list);
    const position = getLastPosition(cardsInList);
    const newCard = await party.database.createItem({
      model: ObjectModel,
      type: PLANNER_TYPE_CARD,
      parent: itemId,
      props: { title, position, listId: list.id }
    });
    console.log('creating link...');
    await party.database.createLink({
      source: list,
      target: newCard,
      type: LINK_LIST_CARD,
      props: { position }
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
    console.log({ cards, id });
    const card = cards.find(l => l.id === id);
    const list = lists.find(l => l.id === listId);
    if (!card || !list) {
      console.warn('Card or list not found when moving card.');
      setIsDragDisabled(false);
      return;
    }
    console.log('moving card', { card });
    const existingLink = card.refs[0];
    if (existingLink) {
      existingLink.model.setProperty('deleted', true);
    }
    console.log('creating new link...');
    await party.database.createLink({
      source: list,
      target: card,
      type: LINK_LIST_CARD,
      props: { position }
    });
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
          onCardLabelToggle={handleToggleCardLabel(selectedCard?.id)}
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
