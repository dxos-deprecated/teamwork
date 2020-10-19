//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { keyToBuffer } from '@dxos/crypto';
import { useItems, useParty } from '@dxos/react-client';

import Tasks from './Tasks';
import { addTask, TYPE_TODO_PAD } from './model';

export const Main = ({ itemId, topic }) => {
  const [item] = useItems({ partyKey: keyToBuffer(topic), type: TYPE_TODO_PAD, id: itemId });
  const party = useParty(keyToBuffer(topic));
  const items = useItems({ partyKey: party.key, parent: itemId });

  const handleAdd = async (props) => {
    await addTask({ party, item }, props);
  };

  const handleUpdate = async (item, { completed, deleted }) => {
    await item.model.setProperty('completed', !!completed);
    await item.model.setProperty('deleted', !!deleted);
  };

  if (!item) return null;

  const title = item.model.getProperty('title') || 'Untitled';

  return (
    <Tasks items={items} onUpdate={handleUpdate} onAdd={handleAdd} title={title} />
  );
};
