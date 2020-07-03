//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import UnsubscribeIcon from '@material-ui/icons/Unsubscribe';

export const PartySettingsMenu = ({ anchorEl, onVisibilityToggle, onUnsubscribe, open, onClose, deletedItemsVisible }) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem button onClick={() => {
        onVisibilityToggle();
        onClose();
      }}>
        <ListItemIcon>
          {deletedItemsVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </ListItemIcon>
        <ListItemText primary={deletedItemsVisible ? 'Hide deleted' : 'Show deleted'} />
      </MenuItem>
      <MenuItem button onClick={() => {
        onUnsubscribe();
        onClose();
      }}>
        <ListItemIcon><UnsubscribeIcon /></ListItemIcon>
        <ListItemText primary="Unsubscribe" />
      </MenuItem>
    </Menu>
  );
};
