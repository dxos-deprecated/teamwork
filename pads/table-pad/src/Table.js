//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { IconButton, Toolbar, TextField, makeStyles, Typography, Divider, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AddColumnIcon from '@material-ui/icons/PlaylistAdd';
import { XGrid, LicenseInfo } from '@material-ui/x-grid';

import useEditableColumns from './useEditableColumns';

LicenseInfo.setLicenseKey(
  '8e409f224dbe0bc80df0fa59e719666fT1JERVI6MTg0NDIsRVhQSVJZPTE2MzU4NjkyOTYwMDAsS0VZVkVSU0lPTj0x'
);

// TODO(burdon): Standardize CSS across pads.
const useStyles = makeStyles(theme => ({
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
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  toolbarItem: {
    marginRight: theme.spacing(2)
  }
}));

export default function Table ({ rows, columns, onAddRow, onAddColumn, onUpdateRow, title, onInitialize }) {
  const classes = useStyles();
  const [active = {}, setActive] = useState(undefined);
  const [newColumn, setNewColumn] = useState('');
  const [newColumnType, setNewColumnType] = useState('text');

  const handleFinish = async (change) => {
    const newValue = change ? change.value : active.value; // allow last minute change when calling onFinish
    await onUpdateRow(active.rowId, active.columnId, newValue);
    setActive(undefined);
  };

  const editableColumns = useEditableColumns(columns, {
    active,
    onCancel: () => setActive(undefined),
    onChange: (value) => setActive(old => ({ ...old, value })),
    onFinish: handleFinish
  });

  const handleAddColumn = () => {
    onAddColumn(newColumn, newColumnType);
    setNewColumn('');
    setNewColumnType('text');
  };

  return (
    <div className={classes.root}>
      <Typography>{title}</Typography>
      <Divider className={classes.divider}/>

      <Toolbar variant='dense' disableGutters>
        <Button
          className={classes.toolbarItem}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          disabled={!newColumn}
          onClick={handleAddColumn}
        >
          Add column
        </Button>

        <TextField
          className={classes.toolbarItem}
          placeholder='New column'
          value={newColumn}
          onChange={e => setNewColumn(e.target.value)}
        />
        <FormControl component="fieldset" className={classes.toolbarItem}>
          <FormLabel component="legend">Column type</FormLabel>
          <RadioGroup value={newColumnType} onChange={e => setNewColumnType(e.target.value)}>
            <FormControlLabel value="text" control={<Radio />} label="Text" />
            <FormControlLabel value="checkbox" control={<Radio />} label="Checkbox" />
          </RadioGroup>
        </FormControl>
      </Toolbar>

      <Toolbar variant='dense' disableGutters>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => onAddRow({})}
        >
        Add row
        </Button>
      </Toolbar>

      <Divider className={classes.divider}/>

      <div className={classes.gridContainer}>
        {(rows && rows.length > 0) ? (
          <XGrid
            rows={rows}
            columns={editableColumns}
            // hideFooter
            rowHeight={36}
            onCellClick={({ row, field, value }) => {
              setActive({ rowId: row.id, columnId: field, value });
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
