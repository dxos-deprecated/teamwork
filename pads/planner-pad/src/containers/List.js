//
// Copyright 2018 DXOS.org
//

import assert from 'assert';
import clsx from 'clsx';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { EditableText } from '@dxos/react-ux';

import { ArchiveButton, RestoreButton } from '../components';
import AddCard from './AddCard';
import DraggableCard from './DraggableCard';

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
  list: {
    minHeight: theme.spacing(5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2)
  },
  deleted: {
    backgroundColor: theme.palette.grey[300]
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

const List = ({ onNewList, list, cards, onUpdateList, onOpenCard, onAddCard, className, embedded, isDragDisabled }) => {
  const classes = useStyles();

  const handleTitleUpdate = (title) => {
    onUpdateList({ title });
  };

  const handleToggleArchive = () => {
    assert(list);
    onUpdateList({ deleted: !list.properties.deleted });
  };

  // TODO(dboreham): Better way to reference object properties vs someObject.properties.someProperty everywhere?

  if (onNewList) {
    if (embedded) return null;
    return (
      <div className={clsx(classes.root, className, classes.newList)}>
        <IconButton onClick={onNewList}>
          <AddIcon />
        </IconButton>
        <Typography className={classes.addSubtitle} variant='h5'>New List</Typography>
      </div>
    );
  }

  return (
    <div className={clsx(classes.root, className, list.properties.deleted ? classes.deleted : '')}>
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
                <Draggable key={card.id} draggableId={card.id} index={index} isDragDisabled={isDragDisabled}>
                  {(provided) => (
                    <DraggableCard
                      key={card.id}
                      card={card}
                      provided={provided}
                      onOpenCard={onOpenCard}
                    />
                  )}
                </Draggable>
              ))}
            {placeholder}
          </div>
        )}
      </Droppable>
      {!embedded && (<>
        <AddCard onAddCard={title => onAddCard(title, list.id)} />
        {list.properties.deleted ? (
          <RestoreButton onClick={handleToggleArchive}>Restore</RestoreButton>
        ) : (
          <ArchiveButton onClick={handleToggleArchive}>Archive</ArchiveButton>
        )}
      </>)}
    </div>
  );
};

export default List;
