//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';

import { getInsertedPositionAtIndex, getChangedPositionAtIndex } from '../model';
import List from './List';

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      padding: 10
    },

    newList: {
      padding: 10,
      marginTop: 10
    },

    draggingOver: {
      marginRight: 250
    },

    scrollBox: {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      display: 'flex',
      padding: 10
    },

    list: {
      '&:not(:last-child)': {
        marginRight: 10
      },
      overflowY: 'auto'
    },

    initializeButton: {
      marginRight: theme.spacing(3)
    }
  };
});

export const DraggableLists = ({
  boardId,
  lists,
  isDragDisabled,
  getCardsForList,
  embedded,
  onOpenCard,
  onAddCard,
  onUpdateList,
  onAddList,
  onMoveList,
  onMoveCard,
  onDragDisabled,
  showArchived,
  onToggleShowArchived
}) => {
  const classes = useStyles();

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return; // No drop target, skip this no-op.
    }
    onDragDisabled();

    if (source.droppableId === boardId) { // Dragging entire lists.
      const movingDown = destination.index > source.index;
      const position = getChangedPositionAtIndex(lists, destination.index, movingDown);
      await onMoveList(draggableId, { position });
    } else { // Dragging cards
      const cardsInList = getCardsForList(destination.droppableId);
      if (source.droppableId === destination.droppableId) {
        // moving in the same list
        const movingDown = destination.index > source.index;
        const position = getChangedPositionAtIndex(cardsInList, destination.index, movingDown);
        await onMoveCard(draggableId, { position });
      } else {
        // moving to another list
        await onMoveCard(draggableId, {
          position: getInsertedPositionAtIndex(cardsInList, destination.index),
          listId: destination.droppableId
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable direction="horizontal" type="column" droppableId={boardId}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} className={classes.scrollBox}>
            <div className={clsx(classes.root, snapshot.isDraggingOver ? classes.draggingOver : '')}>
              {lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index} isDragDisabled={isDragDisabled}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={provided.draggableProps.style}
                      className={clsx(classes.list)}
                    >
                      <List
                        isDragDisabled={isDragDisabled}
                        key={list.id}
                        list={list}
                        cards={getCardsForList(list.id)}
                        onUpdateList={onUpdateList(list.id)}
                        onOpenCard={onOpenCard}
                        onAddCard={onAddCard}
                        embedded={embedded}
                        showArchived={showArchived}
                        onToggleShowArchived={onToggleShowArchived}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>

            {/* The new list placeholder */}
            <List
              className={classes.newList}
              embedded={embedded}
              onNewList={onAddList}
              showMenuOnNewCard={lists.length === 0}
              showArchived={showArchived}
              onToggleShowArchived={onToggleShowArchived}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableLists;
