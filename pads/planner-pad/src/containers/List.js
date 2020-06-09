//
// Copyright 2018 Wireline, Inc.
//

import clsx from 'clsx';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';

import { EditableText } from '@dxos/react-ux';

import { useArrayModel } from '../model/useArrayModel';
import AddCard from './AddCard';
import MiniCard from './MiniCard';

export const LIST_TYPE = 'testing.planner.List';
export const CARD_TYPE = 'testing.planner.Card';

const useStyles = makeStyles(() => ({
  root: {
    flexShrink: 0,
    backgroundColor: 'rgba(0,0,0, 0.03)',
    borderRadius: 3,
    padding: 10,
    width: 280
  },
  header: {
    marginBottom: 10,
    lineHeight: 'inherit !important'
  },
  cardContainer: {
    '&:not(:last-child)': {
      marginBottom: 10
    }
  }
}));

const List = props => {
  const classes = useStyles();
  const { topic, list, onUpdateList, onOpenCard, className } = props;
  const { id: listId } = list;
  const cardsModel = useArrayModel(topic, CARD_TYPE, { listId });
  const cards = cardsModel ? cardsModel.getItems() : [];

  const handleTitleUpdate = title => {
    onUpdateList({ title });
  };

  const handleAddCard = title => {
    cardsModel.push({ listId, title });
  };

  // const handleDragEnd = result => {
  //   const { source, destination } = result;
  //   if (!source || !destination) {
  //     return;
  //   }
  //   cardsModel.moveItemByIndex(source.index, destination.index);
  // };

  const Card = ({ card, provided }) => (
    <div
      className={classes.cardContainer}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <MiniCard
        card={card}
        onOpenCard={() => onOpenCard(card.id)}
        style={provided.draggableProps.style}
      />
    </div >
  );

  // TODO(dboreham): Better way to reference object properties vs someObject.properties.someProperty everywhere?

  return (
    <div className={clsx(classes.root, className)} >
      <div className={classes.header} >
        <EditableText
          key={list.properties.title}
          value={list.properties.title || 'untitled list'}
          onUpdate={handleTitleUpdate}
        />
      </div >
      <Droppable direction="vertical" type="list" droppableId={list.id} >
        {({ innerRef, placeholder }) => (
          <div ref={innerRef} >
            {cards
              .filter(card => !card.deleted)
              .map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index} direction="top" >
                  {(provided, snapshot) => (
                    <Card
                      key={card.id}
                      card={card.properties}
                      index={index}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}
                </Draggable >
              ))}
            {placeholder}
          </div >
        )}
      </Droppable >
      <AddCard onAddCard={handleAddCard} />
    </div >
  );
};

export default List;
