//
// Copyright 2020 DXOS.org
//

import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';

import { keyToString } from '@dxos/crypto';
import { ClientProvider } from '@dxos/react-client';

import { useChannelMessages } from '../src/model';
import { waitUntil, setupClient } from './util';

describe('Test useChannelMessages()', () => {
  let client;
  let party;
  let channelId;
  let topic;

  beforeAll(async () => {
    const setup = await setupClient();
    client = setup.client;
    party = setup.party;
    channelId = setup.channelId;
    topic = keyToString(party.key);
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
