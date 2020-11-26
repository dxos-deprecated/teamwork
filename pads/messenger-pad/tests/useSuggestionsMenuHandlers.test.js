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

import EDITOR_PAD from '../../editor-pad/src/index';
import { useSuggestionsMenuHandlers } from '../src/hooks/suggestions';
import MESSENGER_PAD from '../src/index';
import { setupClient, createItem } from './util';

describe('Test useSuggestionsMenuHandler', () => {
  let client;
  let party;
  let channelId;
  let item;
  const itemName = 'testing-editor';

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

    channelId = (await createItem(party, MESSENGER_PAD, client, 'testing-messenger')).id;
    item = await createItem(party, EDITOR_PAD, client, itemName);
  });

  it('Get options', async () => {
    const wrapper = ({ children }) => (
      <ClientProvider client={client}>
        {children}
      </ClientProvider>
    );

    const render = () => useSuggestionsMenuHandlers(party.key.toHex(), pads, [item], editor, () => null, channelId);
    const { result } = renderHook(render, { wrapper });

    expect(result.error).toBeUndefined();
    const suggestions = result.current.handleSuggestionsGetOptions('').filter(item => item.id !== undefined);
    expect(suggestions.length).toEqual(1);
    expect(suggestions[0].label).toEqual(itemName);
  });
});
