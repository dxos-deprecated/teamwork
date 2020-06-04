//
// Copyright 2018 Wireline, Inc.
//

import React from 'react';

import { Divider, Drawer, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { DeleteConfirmation } from '@dxos/react-ux';

import Input from '../components/Input';

const useStyles = makeStyles(() => ({
  drawer: {
    width: 320
  },
  drawerBox: {
    padding: 20
  },
  drawerField: {
    '&:not(:last-child)': {
      marginBottom: 20
    }
  }
}));

const BoardSettings = ({ isOpen, board, onUpdateBoard, onClose }) => {
  const classes = useStyles();
  const { title, description } = board;

  const Header = () => (
    <div className={classes.drawerBox}>
      <Typography variant="h6" color="inherit">
        Board Settings
      </Typography>
    </div>
  );

  const Metadata = () => (
    <div className={classes.drawerBox}>
      <Input
        label="Board Name"
        className={classes.drawerField}
        key={title}
        value={title || ''}
        onUpdate={title => onUpdateBoard({ title })}
      />
      <Input
        label="Board Description"
        multiline
        className={classes.drawerField}
        key={description}
        value={description ?? ''}
        onUpdate={description => onUpdateBoard({ description })}
      />
    </div>
  );

  const Deletion = () => (
    <div className={classes.drawerBox}>
      <DeleteConfirmation
        deleteLabel="Archive Board..."
        confirmLabel="Archive"
        restoreLabel="Unarchive Board"
        deletedMessage="Board succesfully archived!"
        restoredMessage="Board succesfully restored!"
        isDeleted={board.deleted}
        onDelete={() => onUpdateBoard({ deleted: true })}
        onRestore={() => onUpdateBoard({ deleted: false })}
      />
    </div>
  );

  return (
    <Drawer open={isOpen} anchor="right" onClose={onClose}>
      <div className={classes.drawer}>
        <Header />
        <Divider />
        <Metadata />
        <Divider />
        <Deletion />
      </div>
    </Drawer>
  );
};

export default BoardSettings;
