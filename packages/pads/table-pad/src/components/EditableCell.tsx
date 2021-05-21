//
// Copyright 2018 DXOS.org
//

import React from 'react';

import { Checkbox, TextField } from '@material-ui/core';

export interface EditableCellProps {
  columnType: string,
  value: string,
  onCancel: () => void,
  onChange: (value: any) => void,
  onFinish: (args?: {value: any}) => void
}

const EditableCell = ({ columnType, value, onCancel, onChange, onFinish }: EditableCellProps) => {
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

export default EditableCell;
