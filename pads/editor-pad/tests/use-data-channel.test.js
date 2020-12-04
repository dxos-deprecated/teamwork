//
// Copyright 2020 DXOS.org
//

import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';

import MessengerPad from '@dxos/messenger-pad';
import { ClientProvider } from '@dxos/react-client';

import EditorPad from '../src';
import { useDataChannel } from '../src/data-channel';
import { setupClient, createItem } from './util';

const config = {
  swarm: {
    signal: 'wss://apollo2.kube.moon.dxos.network/dxos/signal',
    ice: {
      urls: 'turn:stun.wireline.ninja:3478',
      username: 'wireline',
      credential: 'wireline'
    }
  }
};

describe('Test useDataChannel()', () => {
  let client;
  let party;
  let documentId;

  beforeAll(async () => {
    const setup = await setupClient(config);
    client = setup.client;
    party = setup.party;
    await EditorPad.register(client);
    await MessengerPad.register(client);
    documentId = (await createItem(party, EditorPad, 'testing-editor')).id;
  });

  it('Render useDataChannel()', async () => {
    const render = () => useDataChannel(documentId);
    const wrapper = ({ children }) => <ClientProvider client={client}>{children}</ClientProvider>;
    const { result } = renderHook(render, { wrapper });
    expect(result.error).toBeUndefined();
  });
});
