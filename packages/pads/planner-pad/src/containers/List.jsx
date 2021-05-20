//
// Copyright 2018 DXOS.org
//

import assert from 'assert';
import clsx from 'clsx';
import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/MoreVert';

import { EditableText } from '@dxos/react-ux';

import { DraggableCard, AddCard, ListSettingsMenu } from '../components';

const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    backgroundColor: 'rgba(0,0,0, 0.03)',
    borderRadius: 3,
    padding: 10,
    width: 240
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    lineHeight: 'inherit !important'
  },
  content: {
    padding: 10
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
    maxHeight: 142,
    position: 'relative',
    marginRight: theme.spacing(2)
  },
  addSubtitle: {
    color: theme.palette.grey[300],
    marginTop: theme.spacing(2)
  },
  newCardSettingsButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1)
  }
}));

const List = ({
  embedded,
  showArchived,
  onToggleShowArchived,
  className = '',
  list = undefined,
  cards = undefined,
  onUpdateList = undefined,
  onOpenCard = undefined,
  onAddCard = undefined,
  isDragDisabled = undefined,
  onNewList = undefined,
  showMenuOnNewCard = false // menu on new card is shown only if it is the only card left
}) => {
  const classes = useStyles();
  const [listSettingsOpen, setListSettingsOpen] = useState(false);
  const listSettingsAnchor = useRef();
  const newListSettingsAnchor = useRef();

  const handleTitleUpdate = (title) => {
    onUpdateList('title', title);
  };

  const handleToggleArchive = () => {
    assert(list);
    onUpdateList('deleted', !list.model.getProperty('deleted'));
  };

  // Common props used by regular list settings, and new list placeholder settings
  const commonListSettingsProps = {
    open: listSettingsOpen,
    onClose: () => setListSettingsOpen(false),
    showArchived: showArchived,
    onToggleShowArchived: onToggleShowArchived
  };

  // TODO(dboreham): Better way to reference object properties vs someObject.properties.someProperty everywhere?
  if (onNewList) {
    if (embedded) {
      return null;
    }
    return (
      <div className={clsx(classes.root, className, classes.newList)}>
        {showMenuOnNewCard && (
          <IconButton
            className={classes.newCardSettingsButton}
            size='small'
            onClick={() => setListSettingsOpen(true)}
            ref={newListSettingsAnchor}
            aria-label='settings'
          >
            <SettingsIcon />
          </IconButton>
        )}
        <IconButton onClick={onNewList}>
          <AddIcon />
        </IconButton>
        <Typography className={classes.addSubtitle} variant='h5'>New List</Typography>
        <ListSettingsMenu
          {...commonListSettingsProps}
          anchorEl={newListSettingsAnchor.current}
          deleted={false}
          labelFilteringDisabled={true}
        />
      </div>
    );
  }

  return (
    <div className={clsx(classes.root, className, list.model.getProperty('deleted') ? classes.deleted : '')}>
      <div className={classes.header}>
        <EditableText
          value={list.model.getProperty('title') || 'untitled list'}
          disabled={embedded}
          onUpdate={handleTitleUpdate}
          bareInput={true}
        />
        <IconButton
          size='small'
          onClick={() => setListSettingsOpen(true)}
          ref={listSettingsAnchor}
          aria-label='settings'
        >
          <SettingsIcon />
        </IconButton>
      </div>
      <Droppable direction="vertical" type="list" droppableId={list.id}>
        {({ innerRef, placeholder }) => (
          <div ref={innerRef} className={classes.list}>
            {cards
              .map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index} isDragDisabled={isDragDisabled}>
                  {(provided) => (
                    <DraggableCard
                      key={card.id}
                      card={card}
                      provided={provided}
                      onOpenCard={onOpenCard}
                      listDeleted={list.model.getProperty('deleted')}
                    />
                  )}
                </Draggable>
              ))}
            {placeholder}
          </div>
        )}
      </Droppable>
      {!embedded && !list.model.getProperty('deleted') && (<>
        <AddCard onAddCard={title => onAddCard(title, list)} />
      </>)}
      <ListSettingsMenu
        {...commonListSettingsProps}
        anchorEl={listSettingsAnchor.current}
        deleted={list.model.getProperty('deleted')}
        onToggleArchive={handleToggleArchive}
      />
    </div>
  );
};

export default List;
