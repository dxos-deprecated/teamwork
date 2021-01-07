//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { keyToBuffer } from '@dxos/crypto';
import { ObjectModel } from '@dxos/object-model';
import { useItems, useParty } from '@dxos/react-client';

import Table from './Table';
import { exampleColumns, exampleRows } from './constants';
import { TABLE_TYPE_TABLE, TABLE_TYPE_RECORD, createRecord, TABLE_TYPE_COLUMN } from './model';

export const Main = ({ itemId, topic }) => {
  const party = useParty(keyToBuffer(topic));
  const [item] = useItems({ partyKey: party.key, type: TABLE_TYPE_TABLE, id: itemId });
  const rowRecords = useItems({ partyKey: party.key, parent: itemId, type: TABLE_TYPE_RECORD });
  const columnRecords = useItems({ partyKey: party.key, parent: itemId, type: TABLE_TYPE_COLUMN });

  if (!item) {
    return null;
  }

  const handleAddRow = async (props) => {
    return await createRecord({ party, itemId }, props);
  };

  const handleUpdateRow = async (itemId, property, value) => {
    console.log({ itemId, property, value });
    rowRecords.find(item => item.id === itemId)?.model?.setProperty(property, value);
  };

  const handleAddColumn = async (headerName) => {
    return await party.database.createItem({
      model: ObjectModel,
      type: TABLE_TYPE_COLUMN,
      parent: itemId,
      props: {
        headerName
      }
    });
  };

  const handleInitialize = async () => {
    const newColumnIds = {};
    for (let i = 0; i < exampleColumns.length; i++) {
      const newColumn = await handleAddColumn(exampleColumns[i]);
      newColumnIds[exampleColumns[i]] = newColumn.id;
    }

    for (let i = 0; i < exampleRows.length; i++) {
      const row = exampleRows[i];
      // change header to id in order to properly save the column value.
      // e.g. { id: 1, lastName: 'Snow' } => { id: 1, xdgawe123f: 'Snow' }
      const transformedRow = Object.keys(row).reduce((acc, curr) => ({ ...acc, [newColumnIds[curr]]: row[curr] }), {});
      console.log({ transformedRow });
      await handleAddRow(transformedRow);
    }
  };

  const title = item.model.getProperty('title') || 'Untitled';
  const columns = columnRecords.map(record => ({ id: record.id, headerName: record.model.getProperty('headerName') }));
  const rows = rowRecords.map(record => ({
    id: record.id,
    ...columns.reduce((acc, curr) => ({ ...acc, [curr.id]: record.model.getProperty(curr.id) }), {})
  }));

  return (
    <Table rows={rows} columns={columns} onUpdateRow={handleUpdateRow} onAddRow={handleAddRow} onAddColumn={handleAddColumn} title={title} onInitialize={handleInitialize} />
  );
};
