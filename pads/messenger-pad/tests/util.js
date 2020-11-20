//
// Copyright 2020 DXOS.org
//

import { Client } from '@dxos/client';
import { createKeyPair, keyToString } from '@dxos/crypto';

import MESSENGER_PAD from '../src/index';

export const setupClient = async () => {
  const client = new Client();
  await client.initialize();
  await client.createProfile({ username: 'userA', ...createKeyPair() });
  const party = await client.echo.createParty();
  await MESSENGER_PAD.register(client);
  const item = await MESSENGER_PAD.create({ party }, { name: 'mymessenger' });
  const channelId = item.id;
  const topic = keyToString(party.key);

  return { client, channelId, topic };
};

export const waitUntil = async (predicate) => {
  const waitForTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));
  while (!predicate()) {
    await waitForTimeout(10);
  }
};
