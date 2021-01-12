//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { keyToBuffer } from '@dxos/crypto';
import { useItems, useParty } from '@dxos/react-client';

import Table from './Table';
import { TABLE_TYPE_TABLE, TABLE_TYPE_RECORD, createRecord, TABLE_TYPE_COLUMN, createColumn } from './model';

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
    rowRecords.find(item => item.id === itemId)?.model?.setProperty(property, value);
  };

  const handleAddColumn = async (headerName, columnType) => {
    return await createColumn({ party, itemId }, { headerName, columnType });
  };

  const title = item.model.getProperty('title') || 'Untitled';

  const columns = columnRecords.map(record => ({
    id: record.id,
    headerName: record.model.getProperty('headerName'),
    columnType: record.model.getProperty('columnType')
  }));

  const rows = rowRecords.map(record => ({
    id: record.id,
    ...columns.reduce((acc, curr) => ({ ...acc, [curr.id]: record.model.getProperty(curr.id) }), {})
  }));

  return (
    <Table
      rows={rows}
      columns={columns}
      onUpdateRow={handleUpdateRow}
      onAddRow={() => handleAddRow({})} // Create with no data by default
      onAddColumn={handleAddColumn}
      title={title}
    />
  );
};
