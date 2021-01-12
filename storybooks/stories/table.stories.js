//
// Copyright 2020 DXOS.org
//

import React from 'react';

import pad, { createRecord, createColumn } from '@dxos/table-pad';

import StorybookInitializer from './StorybookInitializer';
import { exampleColumns, exampleRows } from './constants';

export default {
  title: 'Table pad'
};

export const withTableTab = () => {
  return (
    <StorybookInitializer
      createItem={pad.create}
      pad={pad.main}
    />
  );
};

export const withExampleTableTab = () => {
  const createData = async ({ party, item }) => {
    const itemId = item.id;
    const newColumnIds = {};

    for (let i = 0; i < exampleColumns.length; i++) {
      const newColumn = await createColumn(
        { party, itemId },
        { headerName: exampleColumns[i].headerName, columnType: exampleColumns[i].columnType }
      );
      newColumnIds[exampleColumns[i].headerName] = newColumn.id;
    }

    for (let i = 0; i < exampleRows.length; i++) {
      const row = exampleRows[i];
      // change header to id in order to properly save the column value.
      // e.g. { id: 1, lastName: 'Snow' } => { id: 1, xdgawe123f: 'Snow' }
      const transformedRow = Object.keys(row).reduce((acc, curr) => ({ ...acc, [newColumnIds[curr]]: row[curr] }), {});
      await createRecord({ party, itemId }, transformedRow);
    }
  };

  return (
    <StorybookInitializer
      createItem={pad.create}
      pad={pad.main}
      createData={createData}
    />
  );
};
