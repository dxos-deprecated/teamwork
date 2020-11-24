//
// Copyright 2020 DXOS.org
//

import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';

import { keyToString } from '@dxos/crypto';
import EditorPad from '@dxos/editor-pad';
import MessengerPad from '@dxos/messenger-pad';
import PlannerPad from '@dxos/planner-pad';
import { ClientProvider } from '@dxos/react-client';
import TasksPad from '@dxos/tasks-pad';
import { TextModel } from '@dxos/text-model';

import EDITOR_PAD from '../../editor-pad/src/index';
import { useSuggestionsMenuHandlers } from '../src/hooks/suggestions';
import { waitUntil, setupClient } from './util';

describe('Test useSuggestionsMenuHandler', () => {
  let client;
  let party;
  let topic;
  let channelId;
  let item;
  let itemName;

  const pads = [
    EditorPad,
    MessengerPad,
    PlannerPad,
    TasksPad
  ];

  const editor = { current: null };

  beforeAll(async () => {
    const setup = await setupClient();
    client = setup.client;
    party = setup.party;
    channelId = setup.channelId;
    topic = keyToString(party.key);
    await EDITOR_PAD.register(client);
    itemName = 'testing-editor';
    item = await EDITOR_PAD.create({ party }, { name: itemName });
  });

  it('Get options', async () => {
    const wrapper = ({ children }) => (
      <ClientProvider client={client}>
        {children}
      </ClientProvider>
    );

    const render = () => useSuggestionsMenuHandlers(topic, pads, [item], editor, () => null, channelId);
    const { result } = renderHook(render, { wrapper });

    expect(result.error).toBeUndefined();
    const suggestions = result.current.handleSuggestionsGetOptions('').filter(item => item.id !== undefined);
    expect(suggestions.length).toEqual(1);
    expect(suggestions[0].label).toEqual(itemName);
  });

  it.skip('Select option', async () => {
    const wrapper = ({ children }) => (
      <ClientProvider client={client}>
        {children}
      </ClientProvider>
    );

    const render = () => useSuggestionsMenuHandlers(topic, pads, [item], editor, () => null, channelId);
    const { result } = renderHook(render, { wrapper });

    expect(result.error).toBeUndefined();
  });
});
