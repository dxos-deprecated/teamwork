//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { keyToBuffer } from '@dxos/crypto';
import { useItems, useParty } from '@dxos/react-client';

import Tasks from './Tasks';
import { addTask } from './model';

export const Main = ({ item, topic }) => {
  const party = useParty(keyToBuffer(topic));
  const items = useItems({ partyKey: party.key, parent: item.id });

  const handleAdd = async (props) => {
    await addTask(party, props);
  };

  const handleUpdate = async (item, { completed }) => {
    await item.model.setProperty('completed', completed);
  };

  return (
    <Tasks items={items} onUpdate={handleUpdate} onAdd={handleAdd} title={party.key.toString('hex')} />
  );
};
