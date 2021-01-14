//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { keyToBuffer } from '@dxos/crypto';
import { useItems, useParty } from '@dxos/react-client';

import { GRAPH_PAD } from './model';

export const Main = ({ itemId, topic }) => {
  const party = useParty(keyToBuffer(topic));
  const [item] = useItems({ partyKey: party.key, type: GRAPH_PAD, id: itemId });

  if (!item) {
    return null;
  }

  return (
    <div>This is a new graph pad</div>
  );
};
