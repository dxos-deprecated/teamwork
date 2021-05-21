//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useMemo, useState } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { keyToBuffer } from '@dxos/crypto';
import { Item } from '@dxos/echo-db';
import { ObjectModel } from '@dxos/object-model';
import { useItems, useParty } from '@dxos/react-client';

import { CardDetailsDialog, LabelsDialog } from '../components';
import { labelsContext } from '../hooks';
import { SelectionFilter, useSelection } from '../hooks/useSelection';
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

export interface BoardProps {
  topic: string,
  embedded?: boolean,
  itemId: string
}

export const Board = ({ topic, embedded, itemId }: BoardProps) => {
  const classes = useStyles();
  const party = useParty(keyToBuffer(topic));
  if (!party) {
    throw new Error('Party not found.');
  }
  const [item] = useItems({ partyKey: party.key, type: PLANNER_TYPE_BOARD, id: itemId } as any);

  const listsSelectionFilter = useMemo<SelectionFilter>(() =>
    [{ partyKey: party.key, parent: itemId, type: PLANNER_TYPE_LIST }]
  , []);
  const lists = useSelection(party.database as any, listsSelectionFilter);

  const cardsSelectionFilter = useMemo<SelectionFilter>(() =>
    [{ partyKey: party.key, parent: itemId, type: PLANNER_TYPE_CARD }]
  , []);
  const cards = useSelection(party.database as any, cardsSelectionFilter);

  const [selectedCard, setSelectedCard] = useState<Item<any> | undefined>(undefined);
  const [showArchived, setShowArchived] = useState(false);
  const [isDragDisabled, setIsDragDisabled] = useState(false);
  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [filterByLabel, setFilterByLabel] = useState<string | undefined>(undefined);

  const visibleLists = lists
    .filter(list => list.parent.id === itemId) // TODO(rzadp): The Database Selection in ECHO DB is not supporting filtering by parent ID.
    .filter(c => showArchived || !c.model.getProperty('deleted'))
    .sort(positionCompare);

  const getCardsForList = (listId: string) => getCardsLinkedToList(lists.find(list => list.id === listId));

  const getCardsLinkedToList = (list: Item<any>) => list.links
    .filter(l => !l.model.getProperty('deleted'))
    .map(link => link.target)
    .filter(c => showArchived || !c.model.getProperty('deleted'))
    .filter(c => !filterByLabel || (c.model.getProperty('labels' ?? []).includes(filterByLabel)))
    .sort(positionCompare);

  const handleAddList = async () => {
    await party.database.createItem({
      model: ObjectModel as any,
      type: PLANNER_TYPE_LIST,
      parent: itemId,
      props: { title: 'New List', position: getLastPosition(lists) }
    });
  };

  const handleUpdateListOrCard = (id: string) => async (prop: string, value: any) => {
    const listOrCard = lists.find(l => l.id === id) || cards.find(l => l.id === id);
    await listOrCard.model.setProperty(prop, value);
  };

  const handleToggleCardLabel = (id: string) => async (toggledLabel: string) => {
    const card = cards.find(l => l.id === id);
    const labels = card.model.getProperty('labels') ?? [];
    const labelExists = labels.includes(toggledLabel);
    if (!labelExists) {
      card.model.addToSet('labels', toggledLabel);
    } else {
      card.model.removeFromSet('labels', toggledLabel);
    }
  };

  const handleAddCard = async (title: string, list: Item<any>) => {
    const cardsInList = getCardsLinkedToList(list);
    const position = getLastPosition(cardsInList);
    const newCard = await party.database.createItem({
      model: ObjectModel as any,
      type: PLANNER_TYPE_CARD,
      parent: itemId,
      props: { title, position, listId: list.id }
    });
    await party.database.createLink({
      source: list as any,
      target: newCard,
      type: LINK_LIST_CARD
    });
  };

  const handleToggleArchive = async () => {
    assert(selectedCard);
    await selectedCard!.model.setProperty('deleted', !selectedCard!.model.getProperty('deleted'));
    setSelectedCard(undefined);
  };

  const handleMoveList = async (id: string, { position }: {position: number}) => {
    const list = lists.find(l => l.id === id);
    (position !== undefined) && await list.model.setProperty('position', position);
    setIsDragDisabled(false);
  };

  const handleMoveCard = async (id: string, { position, listId }: {position: number, listId: string}) => {
    const card = cards.find(l => l.id === id);
    const existingLink = card.refs.find((ref: any) => !ref.model.getProperty('deleted'));
    const list = listId ? lists.find(l => l.id === listId) : existingLink.source;
    if (!card || !list || !existingLink) {
      console.warn('Card or list or previous link not found when moving card.');
      setIsDragDisabled(false);
      return;
    }
    await existingLink.model.setProperty('deleted', true);
    await card.model.setProperty('position', position);
    await party.database.createLink({
      source: list,
      target: card,
      type: LINK_LIST_CARD
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
        onFilterByLabel: (label: string) => setFilterByLabel(label),
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
          onOpenCard={(cardId: string) => setSelectedCard(cards.find(c => c.id === cardId))}
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
          onCardUpdate={selectedCard && handleUpdateListOrCard(selectedCard?.id)}
          onCardLabelToggle={selectedCard && handleToggleCardLabel(selectedCard?.id)}
        />
        <LabelsDialog
          open={labelsDialogOpen}
          onClose={() => setLabelsDialogOpen(false)}
          onUpdate={(labelnames: string[]) => item.model.setProperty('labelnames', labelnames)}
        />
      </div>
    </labelsContext.Provider>
  );
};
