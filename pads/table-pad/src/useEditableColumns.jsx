//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { TextField } from '@material-ui/core';

/**
 * Custom cell renderer.
 * https://material-ui.com/components/data-grid/rendering/
 */
const textRenderer = (active, field, onCancel, onChange, onFinish) => ({ value, row: { id } }) => {
  if (active.field === field && active.id === id) {
    return (
      <TextField
        autoFocus
        value={active.value ?? ''}
        onBlur={onFinish}
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
  } else {
    return (
      <>{value}</>
    );
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
      renderCell: textRenderer(active, column.id, onCancel, onChange, onFinish)
    }))
  ];
};

export default useEditableColumns;
