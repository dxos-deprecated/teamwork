//
// Copyright 2020 DXOS.org
//

import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';

import MessengerPad from '@dxos/messenger-pad';
import { ClientProvider } from '@dxos/react-client';

import EditorPad from '../src';
import { useDocumentUpdateModel } from '../src/model';
import { setupClient, createItem, sleep } from './util';

describe('Test useDocumentUpdateModel()', () => {
  let client;
  let party;
  let documentId;

  beforeAll(async () => {
    const setup = await setupClient();
    client = setup.client;
    party = setup.party;
    await EditorPad.register(client);
    await MessengerPad.register(client);
    documentId = (await createItem(party, EditorPad, 'testing-editor')).id;
  });

  it('Add content to document', async () => {
    const render = () => useDocumentUpdateModel(party.key.toHex(), documentId);
    const wrapper = ({ children }) => <ClientProvider client={client}>{children}</ClientProvider>;
    const { result } = renderHook(render, { wrapper });

    expect(result.error).toBeUndefined();

    const model = result.current;

    act(() => {
      model.insert(0, 'Testing text');
    });

    expect(model.content.length).toEqual(1);
  });
});
