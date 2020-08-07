//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { useViews } from '../model/board';
import { CARD_TYPE, LIST_TYPE, useList } from '../model/list';
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
    }
  };
});

export const Board = ({ topic, viewId, embedded }) => {
  const classes = useStyles();

  const viewModel = useViews(topic, viewId);
  const board = viewModel.getById(viewId);

  const listsModel = useList(topic, viewId);
  const lists = listsModel.getObjectsByType(LIST_TYPE).sort(positionCompare);
  const cards = listsModel.getObjectsByType(CARD_TYPE);

  if (!board || !listsModel) {
    return null;
  }

  const handleAddList = () => {
    listsModel.createItem(LIST_TYPE, { title: 'New List', position: getLastPosition(lists) });
  };

  const handleUpdateList = (listId) => (properties) => {
    listsModel.updateItem(listId, properties);
  };

  const handleAddCard = (title, listId) => {
    const cardsInList = getCardsForList(listId);
    listsModel.createItem(CARD_TYPE, { listId, title, position: getLastPosition(cardsInList) });
  };

  const handleInitializeKanban = () => {
    listsModel.createItem(LIST_TYPE, { title: 'TODO', position: 0 });
    listsModel.createItem(LIST_TYPE, { title: 'In Progress', position: 1 });
    listsModel.createItem(LIST_TYPE, { title: 'Done', position: 2 });
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

    if (source.droppableId === board.viewId) { // Dragging entire lists.
      const position = getPositionAtIndex(lists, destination.index);
      listsModel.updateItem(draggableId, { position });
    } else { // Dragging cards
      const cardsInList = getCardsForList(destination.droppableId);
      const position = getPositionAtIndex(cardsInList, destination.index);
      if (source.droppableId === destination.droppableId) {
        listsModel.updateItem(draggableId, { position });
      } else {
        listsModel.updateItem(draggableId, {
          position,
          listId: destination.droppableId
        });
      }
    }
  };

  const Topbar = () => (
    <div className={clsx(classes.topbar, 'MuiDrawer-paperAnchorDockedTop')}>
      { lists.length === 0 && (
        <Button
          variant="outlined"
          size="small"
          onClick={handleInitializeKanban}
          className={classes.initializeButton}
        >
          Initialize kanban
        </Button>
      )}
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon fontSize="small" />}
        onClick={handleAddList}
      >
        Add List
      </Button>
    </div>
  );

  const Lists = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable direction="horizontal" type="column" droppableId={board.viewId}>
        {(provided) => (
          <div ref={provided.innerRef} className={classes.scrollBox}>
            <div className={classes.root}>
              {lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={provided.draggableProps.style}
                      className={classes.list}
                    >
                      <List
                        key={list.id}
                        list={list}
                        cards={getCardsForList(list.id)}
                        onUpdateList={handleUpdateList(list.id)}
                        onOpenCard={() => { }}
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
      {/* <Topbar /> */}
      <Lists />
    </div>
  );
};

const positionCompare = (a, b) => a.properties.position - b.properties.position;

function getLastPosition (list) {
  if (list.length === 0) {
    return 0;
  } else {
    return list[list.length - 1].properties.position + 1;
  }
}

function getPositionAtIndex (list, index) {
  if (list.length === 0) {
    return 0;
  } else if (index === 0) {
    return list[0].properties.position - 1;
  } else if (index >= list.length - 1) {
    return list[list.length - 1].properties.position + 1;
  } else {
    return (list[index - 1].properties.position + list[index].properties.position) / 2;
  }
}
