//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';

import List from '../containers/List';

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
      maxWidth: '100vw',
      display: 'flex',
      padding: 10
    },

    list: {
      '&:not(:last-child)': {
        marginRight: 10
      }
    },

    initializeButton: {
      marginRight: theme.spacing(3)
    }
  };
});

export const DraggableLists = ({ onDragEnd, boardId, lists, isDragDisabled, getCardsForList, embedded, onOpenCard, handleAddCard, handleUpdateList, handleAddList }) => {
  const classes = useStyles();

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
                        onUpdateList={handleUpdateList(list.id)}
                        onOpenCard={onOpenCard}
                        onAddCard={handleAddCard}
                        embedded={embedded}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
            <List
              className={classes.newList}
              embedded={embedded}
              onNewList={handleAddList}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
