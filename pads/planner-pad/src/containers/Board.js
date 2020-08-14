//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';

import { useItems, positionCompare, getLastPosition, getInsertedPositionAtIndex, getChangedPositionAtIndex, CARD_TYPE, LIST_TYPE, useList } from '../model';
import CardDetailsDialog from './CardDetailsDialog';
import List from './List';

const useStyles = makeStyles(theme => {
  return {
    containerRoot: {
      overflow: 'scroll',
      height: '100%'
    },

    root: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      padding: 10
    },

    scrollBox: {
      width: '100%',
      maxWidth: '100vw',
      display: 'flex',
      padding: 10
    },

    topbar: {
      display: 'flex',
      background: 'white',
      padding: 10,
      justifyContent: 'flex-start'
    },

    list: {
      '&:not(:last-child)': {
        marginRight: 10
      }
    },

    initializeButton: {
      marginRight: theme.spacing(3)
    },

    visibilityToggle: {
      marginLeft: theme.spacing(3),
      marginTop: theme.spacing(2)
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

  const itemModel = useItems(topic, itemId);
  const board = itemModel.getById(itemId);
  const listsModel = useList(topic, itemId);

  const [listsCache, setListsCache] = useState(listsModel.getObjectsByType(LIST_TYPE));
  const [cardsCache, setCardsCache] = useState(listsModel.getObjectsByType(CARD_TYPE));

  const lists = listsCache
    .filter(c => showArchived || !c.properties.deleted)
    .sort(positionCompare);

  const cards = cardsCache
    .filter(c => showArchived || !c.properties.deleted);

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

  const handleAddList = () => {
    listsModel.createItem(LIST_TYPE, { title: 'New List', position: getLastPosition(lists) });
  };

  const handleUpdateList = (listId) => (properties) => {
    listsModel.updateItem(listId, properties);
  };

  const handleUpdateCard = (cardId) => (properties) => {
    listsModel.updateItem(cardId, properties);
  };

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

  const getCardsForList = listId => cards
    .filter(card => card.properties.listId === listId)
    .sort(positionCompare);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // No drop target, skip this no-op.
    if (!destination) {
      return;
    }

    setIsDragDisabled(true);

    if (source.droppableId === board.itemId) { // Dragging entire lists.
      const movingDown = destination.index > source.index;
      const position = getChangedPositionAtIndex(lists, destination.index, movingDown);
      handleMoveList(draggableId, { position });
    } else { // Dragging cards
      const cardsInList = getCardsForList(destination.droppableId);
      if (source.droppableId === destination.droppableId) {
        // moving in the same list
        const movingDown = destination.index > source.index;
        const position = getChangedPositionAtIndex(cardsInList, destination.index, movingDown);
        handleMoveCard(draggableId, { position });
      } else {
        // moving to another list
        handleMoveCard(draggableId, {
          position: getInsertedPositionAtIndex(cardsInList, destination.index),
          listId: destination.droppableId
        });
      }
    }
  };

  const Lists = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable direction="horizontal" type="column" droppableId={board.itemId}>
        {(provided) => (
          <div ref={provided.innerRef} className={classes.scrollBox}>
            <div className={classes.root}>
              {lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index} isDragDisabled={isDragDisabled}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={provided.draggableProps.style}
                      className={classes.list}
                    >
                      <List
                        isDragDisabled={isDragDisabled}
                        key={list.id}
                        list={list}
                        cards={getCardsForList(list.id)}
                        onUpdateList={handleUpdateList(list.id)}
                        onOpenCard={cardId => setSelectedCard(cards.find(c => c.id === cardId))}
                        onAddCard={handleAddCard}
                        embedded={embedded}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              <List
                embedded={embedded}
                onNewList={handleAddList}
              />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  return (
    <div className={classes.containerRoot}>
      { isDragDisabled && <CircularProgress className={classes.spinner} />}
      <div className={classes.visibilityToggle}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showArchived}
              value={showArchived}
              onChange={() => setShowArchived(!showArchived)}
            />
          }
          label='Show archived'
        />
      </div>
      <Lists />
      <CardDetailsDialog
        open={!!selectedCard}
        onClose={() => setSelectedCard(undefined)}
        onToggleArchive={handleToggleArchive}
        card={selectedCard}
        onCardUpdate={handleUpdateCard(selectedCard?.id)}
      />
    </div>
  );
};

