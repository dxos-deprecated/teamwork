//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { CardDetailsDialog, LabelsDialog } from '../components';
import { labelsContext } from '../hooks';
import { useItems, positionCompare, getLastPosition, CARD_TYPE, LIST_TYPE, useList } from '../model';
import { defaultLabelNames } from '../model/labels';
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

export const Board = ({ topic, itemId, embedded }) => {
  const classes = useStyles();
  const [selectedCard, setSelectedCard] = useState(undefined);
  const [showArchived, setShowArchived] = useState(false);
  const [isDragDisabled, setIsDragDisabled] = useState(false);
  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [filterByLabel, setFilterByLabel] = useState(undefined);

  const itemModel = useItems(topic, itemId);
  const board = itemModel.getById(itemId);
  const listsModel = useList(topic, itemId);

  const [listsCache, setListsCache] = useState(listsModel.getObjectsByType(LIST_TYPE));
  const [cardsCache, setCardsCache] = useState(listsModel.getObjectsByType(CARD_TYPE));

  const lists = listsCache
    .filter(c => showArchived || !c.properties.deleted)
    .sort(positionCompare);

  const cards = cardsCache
    .filter(c => showArchived || !c.properties.deleted)
    .filter(c => !filterByLabel || (c.properties.labels && c.properties.labels[filterByLabel]));

  const getCardsForList = listId => cards
    .filter(card => card.properties.listId === listId)
    .sort(positionCompare);

  useEffect(() => {
    const updateHandler = () => {
      setListsCache(listsModel.getObjectsByType(LIST_TYPE));
      setCardsCache(listsModel.getObjectsByType(CARD_TYPE));
      setIsDragDisabled(false);
    };

    if (listsModel) {
      listsModel.on('update', updateHandler);
      return () => listsModel.off('update', updateHandler);
    }
  }, [listsModel]);

  if (!board || !listsModel) {
    return null;
  }

  const handleAddList = () => listsModel.createItem(LIST_TYPE, { title: 'New List', position: getLastPosition(lists) });
  const handleUpdateListOrCard = (listId) => (properties) => listsModel.updateItem(listId, properties);

  const handleAddCard = (title, listId) => {
    const cardsInList = getCardsForList(listId);
    listsModel.createItem(CARD_TYPE, { listId, title, position: getLastPosition(cardsInList) });
  };

  const handleToggleArchive = () => {
    assert(selectedCard);
    listsModel.updateItem(selectedCard.id, { deleted: !selectedCard.properties.deleted });
    setSelectedCard(undefined);
  };

  const handleMoveList = (id, newProperties) => {
    setListsCache(old => {
      const moved = old.find(x => x.id === id);
      const newCache = [...old].filter(x => x.id !== id);
      newCache.push({ ...moved, properties: { ...moved.properties, ...newProperties } });
      return newCache;
    });
    listsModel.updateItem(id, newProperties);
  };

  const handleMoveCard = (id, newProperties) => {
    setCardsCache(old => {
      const moved = old.find(x => x.id === id);
      const newCache = [...old].filter(x => x.id !== id);
      newCache.push({ ...moved, properties: { ...moved.properties, ...newProperties } });
      return newCache;
    });
    listsModel.updateItem(id, newProperties);
  };

  return (
    <labelsContext.Provider
      value={{
        filterByLabel,
        names: board.metadata.labelnames ?? defaultLabelNames,
        onFilterByLabel: (label) => setFilterByLabel(label),
        onOpenLabelsDialog: () => setLabelsDialogOpen(true)
      }}
    >
      <div className={classes.containerRoot}>
        { isDragDisabled && <CircularProgress className={classes.spinner} />}
        <DraggableLists
          handleMoveList={handleMoveList}
          handleMoveCard={handleMoveCard}
          lists={lists}
          boardId={board.itemId}
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
          onUpdate={(labelnames) => itemModel.updateItem(board.itemId, { labelnames })}
        />
      </div>
    </labelsContext.Provider>
  );
};
