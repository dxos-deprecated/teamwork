//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { keyToBuffer } from '@dxos/crypto';
import { useItems, useParty } from '@dxos/react-client';

import Table from './Table';
import { TABLE_TYPE_TABLE, createRecord } from './model';

export const Main = ({ itemId, topic }) => {
  const party = useParty(keyToBuffer(topic));
  const [item] = useItems({ partyKey: party.key, type: TABLE_TYPE_TABLE, id: itemId });
  const items = useItems({ partyKey: party.key, parent: itemId });
  if (!item) {
    return null;
  }

  const handleAdd = async (props) => {
    await createRecord({ party, itemId }, props);
  };

  const handleUpdate = async (item, { completed, deleted }) => {
    await item.model.setProperty('completed', !!completed);

    // TODO(burdon): Add logical delete to ECHO (not property).
    await item.model.setProperty('deleted', !!deleted);
  };

  const title = item.model.getProperty('title') || 'Untitled';

  return (
    <Table items={items} onUpdate={handleUpdate} onAdd={handleAdd} title={title} />
  );
};
