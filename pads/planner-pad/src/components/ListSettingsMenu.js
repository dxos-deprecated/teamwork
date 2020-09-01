//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import { PLANNER_LABELS, defaultLabelNames, labelColorLookup } from '../model/labels';

const useStyles = makeStyles({
  root: {
    maxWidth: 400
  }
});

export const ListSettingsMenu = ({ anchorEl, open, onClose, deleted, onToggleArchive, showArchived, onToggleShowArchived, onOpenLabelsDialog, onFilterByLabel, filterByLabel, labelnames = defaultLabelNames }) => {
  const classes = useStyles();

  const handleToggleArchive = () => {
    onToggleArchive();
    onClose();
  };

  const handleToggleShowArchived = () => {
    onToggleShowArchived();
    onClose();
  };

  const handleLabelSettings = () => {
    onOpenLabelsDialog();
    onClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose} className={classes.root}>
      {onToggleArchive && (
        <MenuItem button onClick={handleToggleArchive}>
          <ListItemText primary={deleted ? 'Restore' : 'Archive'} />
        </MenuItem>
      )}
      <MenuItem button onClick={handleToggleShowArchived}>
        <ListItemText primary={showArchived ? 'Hide archived' : 'Show archived'} />
      </MenuItem>
      {onOpenLabelsDialog && (
        <MenuItem button onClick={handleLabelSettings}>
          <ListItemText primary='Label Settings' />
        </MenuItem>
      )}
      {onFilterByLabel && (
        <>
          <Divider />
          <MenuItem disabled={true}>Filters:</MenuItem>
          {PLANNER_LABELS.map(label => (
            <MenuItem
              key={label}
              button
              onClick={() => onFilterByLabel(filterByLabel === label ? undefined : label)}
              selected={filterByLabel === label}
            >
              <ListItemIcon><SearchIcon htmlColor={labelColorLookup[label]} /></ListItemIcon>
              <Typography variant="inherit" noWrap>{labelnames[label]}</Typography>
            </MenuItem>
          ))}
        </>
      )}
    </Menu>
  );
};

export default ListSettingsMenu;
