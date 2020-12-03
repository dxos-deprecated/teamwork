//
// Copyright 2020 DXOS.org
//

import { Client } from '@dxos/client';
import { createKeyPair } from '@dxos/crypto';

export const setupClient = async () => {
  const client = new Client();
  await client.initialize();
  await client.createProfile({ username: 'userA', ...createKeyPair() });
  const party = await client.echo.createParty();
  return party;
};

export const createItem = async (party, pad, itemName) => {
  const item = await pad.create({ party }, { name: itemName });
  return item;
};
