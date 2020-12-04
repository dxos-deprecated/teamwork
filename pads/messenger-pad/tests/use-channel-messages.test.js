//
// Copyright 2020 DXOS.org
//

import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';

import { ClientProvider } from '@dxos/react-client';

import MessengerPad from '../src';
import { useChannelMessages } from '../src/model';
import { waitUntil, setupClient, createItem } from './util';

describe('Test useChannelMessages()', () => {
  let client;
  let party;
  let channelId;

  beforeAll(async () => {
    const setup = await setupClient();
    client = setup.client;
    party = setup.party;
    channelId = (await createItem(party, MessengerPad, client, 'testing-messenger')).id;
  });

  afterAll(async () => {
    await client.destroy();
  });

  it('Sends message', async () => {
    const render = () => useChannelMessages(party.key.toHex(), channelId);
    const wrapper = ({ children }) => <ClientProvider client={client}>{children}</ClientProvider>;
    const { result } = renderHook(render, { wrapper });

    expect(result.error).toBeUndefined();

    const hookResult = {
      messages: result.current[0],
      sendMessage: result.current[1]
    };
    expect(hookResult.messages.length).toEqual(0);

    const messageText = 'Message text';
    act(() => {
      hookResult.sendMessage(messageText);
    });

    await waitUntil(() => hookResult.messages.length > 0);
    expect(hookResult.messages.length).toEqual(1);
    expect(hookResult.messages[0].text).toEqual(messageText);
  });
});
