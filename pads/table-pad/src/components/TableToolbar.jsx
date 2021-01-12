//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { Divider, IconButton, makeStyles, Toolbar, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AddColumnIcon from '@material-ui/icons/ViewColumn';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1)

  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

const TableToolbar = ({ title = '', onAddRow, onAddColumn }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <Toolbar variant='dense' disableGutters>
          <Tooltip title='Add new row'>
            <IconButton size='small' onClick={onAddRow}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Add new column'>
            <IconButton size='small' onClick={onAddColumn}>
              <AddColumnIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Typography>{title}</Typography>
        <div style={{ width: '60px' }} /> {/* For lack of a better idea, a dummy element allowing the title to be positioned at center */}
      </div>
      <Divider />
    </div>
  );
};

export default TableToolbar;
