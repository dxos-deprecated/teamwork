//
// Copyright 2020 DXOS.org
//

import React, { createContext, useContext, useEffect, useState } from 'react';

import { IconButton, Toolbar, TextField, makeStyles, Typography, Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AddColumnIcon from '@material-ui/icons/PlaylistAdd';
import { XGrid, LicenseInfo } from '@material-ui/x-grid';

import { exampleColumns, exampleRows } from './constants';
import useEditableColumns from './useEditableColumns';

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
  },
  initializeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  initializeButton: {
    height: 'fit-content'
  }
}));

export default function Table ({ rows, columns, onAddRow, onAddColumn, onUpdateRow, title, onInitialize }) {
  const classes = useStyles();
  const [active = {}, setActive] = useState(undefined);
  const [newColumn, setNewColumn] = useState('');

  const handleFinish = async () => {
    await onUpdateRow(active.id, active.field, active.value);
    setActive(undefined);
  };

  const editableColumns = useEditableColumns(columns, {
    active,
    onCancel: () => setActive(undefined),
    onChange: (value) => setActive(old => ({ ...old, value })),
    onFinish: handleFinish
  });

  const handleAddRow = async () => onAddRow({ age: null, firstName: 'Anonymous' });

  const handleAddColumn = () => {
    onAddColumn(newColumn);
    setNewColumn('');
  };

  return (
    <div className={classes.root}>
      <Typography>{title}</Typography>
      <Divider/>

      <Toolbar variant='dense' disableGutters>
        <IconButton size='small' onClick={handleAddRow}>
          <AddIcon />
        </IconButton>
        <TextField placeholder='New column' value={newColumn} onChange={e => setNewColumn(e.target.value)} />
        <IconButton size='small' disabled={!newColumn} onClick={handleAddColumn}>
          <AddColumnIcon />
        </IconButton>
      </Toolbar>

      <div className={classes.gridContainer}>
        {(rows && rows.length > 0) ? (
          <XGrid
            rows={rows}
            columns={editableColumns}
            // hideFooter
            rowHeight={36}
            onCellClick={({ row, field, value }) => {
              setActive({ id: row.id, field, value });
            }}
          />
        ) : (
          <div className={classes.initializeContainer}>
            <p>It is empty here. Create your first row, or:&nbsp;</p>
            <button className={classes.initializeButton} onClick={onInitialize}>Initialize</button>
          </div>
        )}
      </div>
    </div>
  );
}
