//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { ClientInitializer } from '@dxos/react-appkit';
import pad, { createRecord, createColumn } from '@dxos/table-pad';

import { exampleColumns, exampleRows, usePadTest, config } from '../utils';

export default {
  title: 'Table pad'
};

const createExampleData = async ({ party, item }) => {
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

const TablePad = ({ createData } = {}) => {
  const { topic, itemId, error } = usePadTest({ createItem: pad.create, createData });
  if (error) {
    throw error;
  }
  if (!topic || !itemId) {
    return null;
  }

  return (
    <pad.main topic={topic} itemId={itemId} />
  );
};

export const withTablePad = () => {
  return (
    <ClientInitializer config={config}>
      <TablePad />
    </ClientInitializer>
  );
};

export const withExampleTableTab = () => {
  return (
    <ClientInitializer config={config}>
      <TablePad createData={createExampleData} />
    </ClientInitializer>
  );
};
