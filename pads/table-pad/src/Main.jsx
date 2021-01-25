//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { keyToBuffer } from '@dxos/crypto';
import { useItems, useParty } from '@dxos/react-client';

import { Table } from './containers';
import { TABLE_TYPE_TABLE, TABLE_TYPE_RECORD, createRecord } from './model';

export const Main = ({ itemId, topic }) => {
  const party = useParty(keyToBuffer(topic));
  const [item] = useItems({ partyKey: party.key, type: TABLE_TYPE_TABLE, id: itemId });
  const rowRecords = useItems({ partyKey: party.key, parent: itemId, type: TABLE_TYPE_RECORD });

  if (!item) {
    return null;
  }

  /*
    The array of columns is hacked into a single ObjectModel:
    field.0.headerName
    field.0.columnType
    field.1.headerName
    (...)
  */
  const itemProperties = item.model.toObject();
  const columnKeys = Object.keys(item.model.toObject()).filter(key => key.match(/field\.*\.*/));
  const columnIndexes = Array.from(new Set(
    columnKeys.map(key => key.split('.')[1]) // id of the column
  ));
  const columns = columnIndexes.reduce((prev, curr) => {
    return [
      ...prev,
      {
        id: curr,
        headerName: itemProperties[`field.${curr}.headerName`],
        columnType: itemProperties[`field.${curr}.columnType`]
      }
    ];
  }, []);

  const handleAddRow = async (props) => {
    return await createRecord({ party, itemId }, props);
  };

  const handleUpdateRow = async (itemId, property, value) => {
    rowRecords.find(item => item.id === itemId)?.model?.setProperty(property, value);
  };

  const handleAddColumn = async (headerName, columnType) => {
    const highestColumnId = columnIndexes.length === 0
      ? -1
      : parseInt(columnIndexes.sort()[columnIndexes.length - 1]);

    await item.model.setProperty(`field.${highestColumnId + 1}.headerName`, headerName);
    await item.model.setProperty(`field.${highestColumnId + 1}.columnType`, columnType);
  };

  const title = item.model.getProperty('title') || 'Untitled';

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
