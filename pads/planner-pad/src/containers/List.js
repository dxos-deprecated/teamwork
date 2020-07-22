//
// Copyright 2018 DXOS.org
//

import clsx from 'clsx';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { EditableText } from '@dxos/react-ux';

import AddCard from './AddCard';
import MiniCard from './MiniCard';

const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    backgroundColor: 'rgba(0,0,0, 0.03)',
    borderRadius: 3,
    padding: 10,
    width: 240
  },
  header: {
    marginBottom: 10,
    lineHeight: 'inherit !important'
  },
  cardContainer: {
    '&:not(:last-child)': {
      marginBottom: 10
    }
  },
  list: {
    minHeight: theme.spacing(5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2)
  },
  newList: {
    padding: theme.spacing(2),
    textAlign: 'center',
    maxHeight: 142
  },
  addSubtitle: {
    color: theme.palette.grey[300],
    marginTop: theme.spacing(2)
  }
}));

const List = ({ onNewList, list, cards, onUpdateList, onOpenCard, onAddCard, className, embedded }) => {
  const classes = useStyles();

  const handleTitleUpdate = (title) => {
    onUpdateList({ title });
  };

  const Card = ({ card, provided }) => (
    <div
      className={classes.cardContainer}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <MiniCard
        card={card.properties}
        onOpenCard={() => onOpenCard(card.id)}
        style={provided.draggableProps.style}
      />
    </div>
  );

  // TODO(dboreham): Better way to reference object properties vs someObject.properties.someProperty everywhere?

  if (onNewList) {
    if (embedded) return null;
    return (
      <div className={clsx(classes.root, className, classes.newList)}>
        <IconButton className={classes.addButton} onClick={onNewList}>
          <AddIcon className={classes.addIcon} />
        </IconButton>
        <Typography className={classes.addSubtitle} variant='h5'>New List</Typography>
      </div>
    );
  }

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.header}>
        <EditableText
          key={list.properties.title}
          value={list.properties.title || 'untitled list'}
          disabled={embedded}
          onUpdate={handleTitleUpdate}
          bareInput={true}
        />
      </div>
      <Droppable direction="vertical" type="list" droppableId={list.id}>
        {({ innerRef, placeholder }) => (
          <div ref={innerRef} className={classes.list}>
            {cards
              .filter(card => !card.deleted)
              .map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      key={card.id}
                      card={card}
                      index={index}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}
                </Draggable>
              ))}
            {placeholder}
          </div>
        )}
      </Droppable>
      {!embedded && <AddCard onAddCard={title => onAddCard(title, list.id)} />}
    </div>
  );
};

export default List;
