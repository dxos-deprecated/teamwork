import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

export const DocumentTypeSelectDialog = ({ open, pads, onSelect }) => (
  <Dialog open={open} onClose={() => onSelect(undefined)}>
    <DialogTitle>Choose app</DialogTitle>
    <List>
      {pads.map(pad => (
        <ListItem button key={pad.type} onClick={() => onSelect(pad.type)}>
          <ListItemIcon>
            <pad.icon />
          </ListItemIcon>
          <ListItemText primary={pad.displayName} />
        </ListItem>
      ))}
    </List>
  </Dialog>
)