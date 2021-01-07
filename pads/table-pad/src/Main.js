//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { keyToBuffer } from '@dxos/crypto';
import { useItems, useParty } from '@dxos/react-client';

import Table from './Table';
import { TABLE_TYPE_TABLE, TABLE_TYPE_RECORD, createRecord } from './model';

export const Main = ({ itemId, topic }) => {
  const party = useParty(keyToBuffer(topic));
  const [item] = useItems({ partyKey: party.key, type: TABLE_TYPE_TABLE, id: itemId });
  const records = useItems({ partyKey: party.key, parent: itemId, type: TABLE_TYPE_RECORD });

  if (!item) {
    return null;
  }

  const handleAdd = async (props) => {
    await createRecord({ party, itemId }, props);
  };

  const handleUpdate = async (itemId, property, value) => {
    records.find(item => item.id === itemId)?.model?.setProperty(property, value);
  };

  const title = item.model.getProperty('title') || 'Untitled';

  const rows = records.map(record => ({
    id: record.id,
    firstName: record.model.getProperty('firstName'),
    lastName: record.model.getProperty('lastName'),
    age: record.model.getProperty('age')
  }));

  return (
    <Table rows={rows} onUpdate={handleUpdate} onAdd={handleAdd} title={title} />
  );
};
