//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import { usePads } from '@dxos/react-appkit';

export const DocumentTypeSelectDialog = ({ open, onSelect }) => {
  const [pads] = usePads();
  return (
    <Dialog open={open} onClose={() => onSelect(undefined)}>
      <DialogTitle>Choose app</DialogTitle>
      <List>
        {pads.map(pad => (
          <ListItem button key={pad.type} onClick={() => onSelect(pad.type)}>
            <ListItemIcon>
              <pad.icon />
            </ListItemIcon>
            <ListItemText primary={pad.displayName} secondary={pad.description} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};