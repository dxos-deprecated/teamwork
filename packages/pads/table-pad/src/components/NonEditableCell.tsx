//
// Copyright 2018 DXOS.org
//

import React from 'react';

import CheckIcon from '@material-ui/icons/Check';

export interface NonEditableCellProps {
  columnType: string,
  value: string,
}

const NonEditableCell = ({ columnType, value }: NonEditableCellProps) => {
  if (columnType === 'checkbox') {
    return value ? <CheckIcon /> : null;
  }

  return (
    <>{value}</>
  );
};

export default NonEditableCell;
