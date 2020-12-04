//
// Copyright 2020 DXOS.org
//

import { Client } from '@dxos/client';
import { createKeyPair } from '@dxos/crypto';

export const config = {
  swarm: {
    signal: 'wss://apollo2.kube.moon.dxos.network/dxos/signal',
    ice: {
      urls: 'turn:stun.wireline.ninja:3478',
      username: 'wireline',
      credential: 'wireline'
    }
  },
  ipfs: {
    server: 'https://apollo2.kube.moon.dxos.network/dxos/ipfs/api',
    gateway: 'https://apollo2.kube.moon.dxos.network/dxos/ipfs/gateway/'
  }
};

export const setupClient = async () => {
  const client = new Client(config);
  await client.initialize();
  await client.createProfile({ username: 'userA', ...createKeyPair() });
  const party = await client.echo.createParty();
  return { party, client };
};

export const createItem = async (party, pad, itemName) => {
  const item = await pad.create({ party }, { name: itemName });
  return item;
};

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
