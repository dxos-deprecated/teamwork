//
// Copyright 2020 DXOS.org
//

import React from 'react';

import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export const ListSettingsMenu = ({ anchorEl, open, onClose, deleted, onToggleArchive, showArchived, onToggleShowArchived }) => {
  const handleToggleArchive = () => {
    onToggleArchive();
    onClose();
  };

  const handleToggleShowArchived = () => {
    onToggleShowArchived();
    onClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {onToggleArchive && (
        <MenuItem button onClick={handleToggleArchive}>
          <ListItemText primary={deleted ? 'Restore' : 'Archive'} />
        </MenuItem>
      )}
      <MenuItem button onClick={handleToggleShowArchived}>
        <ListItemText primary={showArchived ? 'Hide archived' : 'Show archived'} />
      </MenuItem>
    </Menu>
  );
};

export default ListSettingsMenu;
