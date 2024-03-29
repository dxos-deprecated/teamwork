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

import { useLabels } from '../hooks';

const useStyles = makeStyles({
  root: {
    maxWidth: 400
  }
});

export const ListSettingsMenu = ({
  anchorEl,
  open,
  onClose,
  deleted,
  showArchived,
  onToggleShowArchived,
  onToggleArchive = undefined,
  labelFilteringDisabled = false
}) => {
  const classes = useStyles();
  const { names, filterByLabel, onFilterByLabel, onOpenLabelsDialog, labels, colorLookup } = useLabels();

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
    <Menu anchorEl={anchorEl} open={open} onClose={onClose} className={classes.root} variant='menu'>
      {onToggleArchive && (
        <MenuItem button onClick={handleToggleArchive}>
          <ListItemText primary={deleted ? 'Restore' : 'Archive'} />
        </MenuItem>
      )}
      <MenuItem button onClick={handleToggleShowArchived}>
        <ListItemText primary={showArchived ? 'Hide archived' : 'Show archived'} />
      </MenuItem>
      {!labelFilteringDisabled && ([
        <MenuItem key='label-settings' button onClick={handleLabelSettings}>
          <ListItemText primary='Label Settings' />
        </MenuItem>,
        <Divider key='divider' />,
        <MenuItem key='filters' disabled={true}>Filters:</MenuItem>,
        ...labels.map(label => (
          <MenuItem
            key={label}
            button
            onClick={() => onFilterByLabel(filterByLabel === label ? undefined : label)}
            selected={filterByLabel === label}
          >
            <ListItemIcon><SearchIcon htmlColor={colorLookup[label]} /></ListItemIcon>
            <Typography variant="inherit" noWrap>{names[label]}</Typography>
          </MenuItem>
        ))
      ]
      )}
    </Menu>
  );
};

export default ListSettingsMenu;
