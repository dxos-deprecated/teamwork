//
// Copyright 2020 DXOS.org
//

import { render } from '@testing-library/react';
import React from 'react';

import MessengerPad from '@dxos/messenger-pad';
import PlannerPad from '@dxos/planner-pad';
import { ClientProvider } from '@dxos/react-client';
import TasksPad from '@dxos/tasks-pad';

import EditorPad from '../src';
import { Editor } from '../src/components/Editor';
import { setupClient, createItem } from './util';

const pads = [
  EditorPad,
  MessengerPad,
  PlannerPad,
  TasksPad
];

describe('Test Editor', () => {
  let client;
  let party;
  let documentId;
  let messengerItem;

  beforeAll(async (done) => {
    const setup = await setupClient();
    client = setup.client;
    party = setup.party;
    await EditorPad.register(client);
    await MessengerPad.register(client);
    documentId = (await createItem(party, EditorPad, 'testing-editor')).id;
    messengerItem = await createItem(party, MessengerPad, 'testing-messenger');

    done();
  });

  afterAll(async () => {
    await client.destroy();
  });

  it('Render Editor', async () => {
    const title = 'Testing editor';
    expect(() => render(
      <ClientProvider client={client}>
        <Editor
          title={title}
          topic={party.key.toHex()}
          itemId={documentId}
          pads={pads}
          items={[messengerItem]}
        />
      </ClientProvider>
    )).not.toThrow();
  });
});
