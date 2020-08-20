//
// Copyright 2020 DXOS.org
//

import React from 'react';

import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import Divider from '@material-ui/core/Divider';

import { PLANNER_LABELS, toggleLabel, labelColorLookup, defaultLabelNames } from '../model/labels';

export const ListSettingsMenu = ({ anchorEl, open, onClose, deleted, onToggleArchive, showArchived, onToggleShowArchived, onOpenLabelsDialog, onFilterByLabel, filterByLabel }) => {
  const handleToggleArchive = () => {
    onToggleArchive();
    onClose();
  };

  const handleToggleShowArchived = () => {
    onToggleShowArchived();
    onClose();
  };

  const handlelabelSettings = () => {
    onOpenLabelsDialog();
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
      {onOpenLabelsDialog && (
        <MenuItem button onClick={handlelabelSettings}>
          <ListItemText primary='Labels' />
        </MenuItem>
      )}
      {onFilterByLabel && (
        <>
          <Divider />
          {PLANNER_LABELS.map(label => (
            <MenuItem key={label} button onClick={() => onFilterByLabel(filterByLabel === label ? undefined : label)}>
              {filterByLabel === label && (
                <ListItemIcon><SearchIcon /></ListItemIcon>
              )}
              <ListItemText primary={defaultLabelNames[label]} />
            </MenuItem>
          ))}
          <MenuItem button onClick={() => onFilterByLabel(undefined)}>
            <ListItemText primary='Clear filter' />
          </MenuItem>
        </>
      )}
    </Menu>
  );
};

export default ListSettingsMenu;
