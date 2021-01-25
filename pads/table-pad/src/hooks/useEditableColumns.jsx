//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { Checkbox, TextField } from '@material-ui/core';

import { NonEditableCell } from '../components/NonEditableCell';

const EditableCell = ({ columnType, value, onCancel, onChange, onFinish }) => {
  if (columnType === 'text') {
    return (
      <TextField
        inputProps={{ autoFocus: true }} // Seems to be working more reliably than just autoFocus. // https://github.com/mui-org/material-ui/issues/7247#issuecomment-310935910
        defaultValue={value ?? ''}
        onBlur={() => onFinish()}
        onKeyUp={event => {
          if (event.key === 'Escape') {
            onCancel();
          } else if (event.key === 'Enter') {
            onFinish();
          }
        }}
        onChange={e => onChange(e.target.value)}
      />
    );
  }
  if (columnType === 'checkbox') {
    const checked = String(value).toLowerCase() === 'true';
    return (
      <Checkbox
        checked={checked}
        onClick={() => {
          onFinish({ value: !checked });
        }}
      />
    );
  }

  // column not recognized, falling back to just a value
  return (
    <>{value}</>
  );
};

/**
 * Custom cell renderer.
 * https://material-ui.com/components/data-grid/rendering/
 */
const cellRenderer = (active, column, onCancel, onChange, onFinish) => ({ value, row: { id } }) => {
  if (active.columnId === column.id && active.rowId === id) {
    return (
      <EditableCell
        columnType={column.columnType}
        onCancel={onCancel}
        onChange={onChange}
        onFinish={onFinish}
        value={active.value}
      />
    );
  } else {
    return <NonEditableCell columnType={column.columnType} value={value} />;
  }
};

const useEditableColumns = (columns, { active = {}, onCancel, onChange, onFinish } = {}) => {
  return [
    {
      field: 'id',
      headerName: 'ID',
      width: 130
    },
    ...columns.map(column => ({
      field: column.id,
      headerName: column.headerName,
      width: 130,
      renderCell: cellRenderer(active, column, onCancel, onChange, onFinish)
    }))
  ];
};

export default useEditableColumns;
