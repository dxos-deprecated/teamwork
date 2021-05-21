//
// Copyright 2020 DXOS.org
//

import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import MessengerPad from '@dxos/messenger-pad';
import { ClientProvider } from '@dxos/react-client';

import EditorPad from '../src';
import { useDataChannel } from '../src/data-channel';
import { setupClient, createItem } from './util';

describe('Test useDataChannel()', () => {
  let client;
  let party;
  let documentId;

  beforeAll(async (done) => {
    const setup = await setupClient();
    client = setup.client;
    party = setup.party;
    await EditorPad.register(client);
    await MessengerPad.register(client);
    documentId = (await createItem(party, EditorPad, 'testing-editor')).id;

    done();
  });

  afterAll(async () => {
    await client.destroy();
  });

  it('Render useDataChannel()', async () => {
    const render = () => useDataChannel(documentId);
    const wrapper = ({ children }) => <ClientProvider client={client}>{children}</ClientProvider>;
    const { result } = renderHook(render, { wrapper });
    expect(result.error).toBeUndefined();
  });
});
