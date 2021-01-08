//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { Checkbox, TextField } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

const EditableCell = ({ columnType, value, onCancel, onChange, onFinish }) => {
  if (columnType === 'text') {
    return (
      <TextField
        autoFocus
        value={value ?? ''}
        onBlur={() => onFinish({})}
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

const NonEditableCell = ({ columnType, value }) => {
  if (columnType === 'checkbox') {
    return value ? <CheckIcon /> : null;
  }

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
    console.debug('brand new EditableCell gets returned');
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
