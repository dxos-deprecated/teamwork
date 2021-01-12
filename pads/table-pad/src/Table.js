//
// Copyright 2020 DXOS.org
//

import React, { useRef, useState } from 'react';

import { Toolbar, TextField, makeStyles, Typography, Divider, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import { XGrid, LicenseInfo } from '@material-ui/x-grid';

import { AddColumn } from './components';
import NoRows from './components/NoRows';
import TableToolbar from './components/TableToolbar';
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
  const createColumnAnchor = useRef(null);
  const [addColumnOpen, setAddColumnOpen] = useState(false);

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

  return (
    <div className={classes.root}>
      <div className={classes.gridContainer}>
        <XGrid
          ref={createColumnAnchor}
          showToolbar
          components={{
            header: () => <TableToolbar title={title} onAddRow={onAddRow} onAddColumn={() => setAddColumnOpen(true)} />
          }}
          rows={rows}
          columns={rows && rows.length > 0 && editableColumns} // do not show the columns if there are no rows yet
          rowHeight={36}
          onCellClick={({ row, field, value }) => {
            if (!active || active.columnId !== field || active.rowId !== row.id) {
              setActive({ rowId: row.id, columnId: field, value });
            }
          }}
        />
        <AddColumn open={addColumnOpen} onClose={() => setAddColumnOpen(false)} onAddColumn={onAddColumn} />
      </div>
    </div>
  );
}
