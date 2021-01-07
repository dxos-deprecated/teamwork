//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { TextField } from '@material-ui/core';

/**
 * Custom cell renderer.
 * https://material-ui.com/components/data-grid/rendering/
 */
const textRenderer = (active, field, onCancel) => ({ value, row: { id } }) => {
  if (active.field === field && active.id === id) {
    return (
      <TextField
        autoFocus
        value={value === null ? '' : value}
        onBlur={onCancel}
        onKeyUp={event => {
          if (event.key === 'Escape') {
            onCancel();
          }
        }}
      />
    );
  } else {
    return (
      <>{value}</>
    );
  }
};

const useColumns = ({ active = {} } = {}, handleCancel) => {
  return [
    {
      field: 'id',
      headerName: 'ID',
      width: 70
    },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 130,
      renderCell: textRenderer(active, 'firstName', handleCancel)
      // TODO(burdon): Menu button.
      // renderHeader: ({ colDef: { headerName } }) => {
      //   return (
      //     <div>{headerName}</div>
      //   );
      // }
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 130,
      renderCell: textRenderer(active, 'lastName', handleCancel)
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      resizable: true,
      // renderCell: textRenderer(active, 'fullName', handleCancel),
      valueGetter: (params) =>
        `${params.getValue('firstName') || ''} ${
          params.getValue('lastName') || ''
        }`
    }
  ];
};

export default useColumns;
