//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { EditableCell, NonEditableCell } from '../components';

export interface CellRendererOptions extends UseEditableColumnsOptions {
  column: any
}

/**
 * Custom cell renderer.
 * https://material-ui.com/components/data-grid/rendering/
 */
const cellRenderer = ({ active, column, onCancel, onChange, onFinish }: CellRendererOptions) =>
  ({ value, row: { id } }: {value: any, row: any}) => {
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

export interface UseEditableColumnsOptions {
  active?: any,
  onCancel: () => void,
  onChange: (value: any) => void,
  onFinish: (args?: {value: any}) => void
}

export const useEditableColumns = (
  columns: any[],
  { active = {}, onCancel, onChange, onFinish }: UseEditableColumnsOptions
) => {
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
      renderCell: cellRenderer({ active, column, onCancel, onChange, onFinish })
    }))
  ];
};
