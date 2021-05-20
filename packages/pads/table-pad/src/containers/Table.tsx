//
// Copyright 2020 DXOS.org
//

import React, { useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core';
import { XGrid, LicenseInfo } from '@material-ui/x-grid';

import { AddColumn, TableToolbar } from '../components';
import { useEditableColumns } from '../hooks';

if (!process.env.XGRID_LICENCE && !process.env.STORYBOOK_XGRID_LICENCE) {
  console.warn('Please provide XGRID_LICENCE environment variable for XGrid.');
}

LicenseInfo.setLicenseKey(process.env.XGRID_LICENCE ?? process.env.STORYBOOK_XGRID_LICENCE ?? '');

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

export interface TableProps {
  rows: any,
  columns: any,
  onAddRow: any,
  onAddColumn: any,
  onUpdateRow: any,
  title: string,
}

export const Table = ({ rows, columns, onAddRow, onAddColumn, onUpdateRow, title }: TableProps) => {
  const classes = useStyles();
  const [active = {}, setActive] = useState<any>(undefined);
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const createColumnAnchor = useRef(null);

  const handleFinish = async (change: any) => {
    const newValue = change ? change.value : active.value; // allow last minute change when calling onFinish
    await onUpdateRow(active.rowId, active.columnId, newValue);
    setActive(undefined);
  };

  const editableColumns = useEditableColumns(columns, {
    active,
    onCancel: () => setActive(undefined),
    onChange: (value: any) => setActive((old: any) => ({ ...old, value })),
    onFinish: handleFinish
  });

  return (
    <div className={classes.root}>
      <div className={classes.gridContainer}>
        <XGrid
          ref={createColumnAnchor}
          components={{
            Toolbar: () => <TableToolbar title={title} onAddRow={onAddRow} onAddColumn={() => setAddColumnOpen(true)} />
          }}
          rows={rows}
          columns={(rows && rows.length > 0 && editableColumns) || []} // do not show the columns if there are no rows yet
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
};

export default Table;
