//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { ViewSettingsDialog } from '@dxos/react-appkit';
import { makeStyles } from '@material-ui/core/styles';

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

const CustomViewSettingsDialog = ({ open, onClose, viewModel, viewId, pads, board, onUpdate }) => {
  const classes = useStyles();
  const { metadata: { description = '' } } = board;

  return (
    <ViewSettingsDialog
      open={open}
      onClose={onClose}
      viewModel={viewModel}
      pads={pads}
      viewId={viewId}
    >
      <Input
        label="Board Description"
        multiline
        className={classes.drawerField}
        key={description}
        value={description ?? ''}
        onUpdate={description => onUpdate({ description })}
      />
    </ViewSettingsDialog>
  );
};

export default CustomViewSettingsDialog;
