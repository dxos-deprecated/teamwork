//
// Copyright 2020 DXOS.org
//

import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';

import { Client } from '@dxos/client';
import { createKeyPair, keyToString } from '@dxos/crypto';
import { ClientProvider } from '@dxos/react-client';

import MESSENGER_PAD from '../src/index';
import { useChannelMessages } from '../src/model';
import { waitUntil } from './util';

describe.only('Test useChannelMessages()', () => {
  let client;
  let topic;
  let channelId;

  beforeAll(async () => {
    client = new Client();
    await client.initialize();
    await client.createProfile({ username: 'userA', ...createKeyPair() });
    const party = await client.echo.createParty();
    await MESSENGER_PAD.register(client);
    const item = await MESSENGER_PAD.create({ party }, { name: 'mymessenger' });
    channelId = item.id;
    topic = keyToString(party.key);
  });

  afterAll(async () => {
    await client.destroy();
  });

  it('Send message', async () => {
    const render = () => useChannelMessages(topic, channelId);

    const wrapper = ({ children }) => <ClientProvider client={client}>{children}</ClientProvider>;
    const { result } = renderHook(render, { wrapper });

    expect(result.error).toBeUndefined();
    expect(result.current[0].length).toEqual(0);

    const messageText = 'Message text';
    act(() => {
      result.current[1](messageText);
    });

    await waitUntil(() => result.current[0].length > 0);

    expect(result.current[0].length).toEqual(1);
    expect(result.current[0][0].text).toEqual(messageText);
  });
});
