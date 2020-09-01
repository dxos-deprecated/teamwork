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

import { DraggableCard } from '../components';
import AddCard from './AddCard';
import ListSettingsMenu from './ListSettingsMenu';

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

const List = ({ onNewList, list, cards, onUpdateList, onOpenCard, onAddCard, className, embedded, isDragDisabled, showArchived, onToggleShowArchived, onOpenLabelsDialog, onFilterByLabel, filterByLabel, showMenuOnNewCard = false }) => {
  const classes = useStyles();
  const [listSettingsOpen, setListSettingsOpen] = useState(false);
  const listSettingsAnchor = useRef();
  const newListSettingsAnchor = useRef();

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
        {showMenuOnNewCard && (
          <IconButton
            className={classes.newCardSettingsButton}
            size='small'
            onClick={() => setListSettingsOpen(true)}
            ref={newListSettingsAnchor}
          >
            <SettingsIcon />
          </IconButton>
        )}
        <IconButton onClick={onNewList}>
          <AddIcon />
        </IconButton>
        <Typography className={classes.addSubtitle} variant='h5'>New List</Typography>
        <ListSettingsMenu
          anchorEl={newListSettingsAnchor.current}
          open={listSettingsOpen}
          onClose={() => setListSettingsOpen(false)}
          deleted={false}
          onToggleArchive={undefined}
          showArchived={showArchived}
          onToggleShowArchived={onToggleShowArchived}
          onOpenLabelsDialog={onOpenLabelsDialog}
        />
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
        <IconButton
          size='small'
          onClick={() => setListSettingsOpen(true)}
          ref={listSettingsAnchor}
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
                      listDeleted={list.properties.deleted}
                    />
                  )}
                </Draggable>
              ))}
            {placeholder}
          </div>
        )}
      </Droppable>
      {!embedded && !list.properties.deleted && (<>
        <AddCard onAddCard={title => onAddCard(title, list.id)} />
      </>)}
      <ListSettingsMenu
        anchorEl={listSettingsAnchor.current}
        open={listSettingsOpen}
        onClose={() => setListSettingsOpen(false)}
        deleted={list.properties.deleted}
        onToggleArchive={handleToggleArchive}
        showArchived={showArchived}
        onToggleShowArchived={onToggleShowArchived}
        onOpenLabelsDialog={onOpenLabelsDialog}
        onFilterByLabel={onFilterByLabel}
        filterByLabel={filterByLabel}
      />
    </div>
  );
};

export default List;
