//
// Copyright 2020 DXOS.org
//

import React, { createContext, useContext, useEffect, useState } from 'react';

import { IconButton, Toolbar, TextField, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AddColumnIcon from '@material-ui/icons/PlaylistAdd';
import { XGrid, LicenseInfo } from '@material-ui/x-grid';

import { initialData } from './constants';
import useColumns from './useColumns';

LicenseInfo.setLicenseKey(
  '8e409f224dbe0bc80df0fa59e719666fT1JERVI6MTg0NDIsRVhQSVJZPTE2MzU4NjkyOTYwMDAsS0VZVkVSU0lPTj0x'
);

// TODO(burdon): Standardize CSS across pads.
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 500
  }
}));

export default function Table ({ items, onAdd, onUpdate }) {
  const classes = useStyles();
  const [active = {}, setActive] = useState(undefined);
  const columns = useColumns({ active }, () => setActive(undefined));
  const [rows] = useState(initialData);

  const handleAddRow = async () => null;

  const handleAddColumn = async () => null;

  console.log(rows)

  return (
    <div className={classes.root}>
      <Toolbar variant='dense' disableGutters>
        <IconButton size='small' onClick={handleAddRow}>
          <AddIcon />
        </IconButton>
        <IconButton size='small' onClick={handleAddColumn}>
          <AddColumnIcon />
        </IconButton>
      </Toolbar>

      <div className={classes.gridContainer}>
        <XGrid
          rows={rows}
          columns={columns}
          // hideFooter
          rowHeight={36}
          // onCellClick={({ data, field }) => {
          //   setActive({ id: data.id, field });
          // }}
        />
      </div>
    </div>
  );
}
