//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Description';

import { MessengerModel } from '@dxos/messenger-model';
import { MESSENGER_TYPE_MESSAGE } from '@dxos/messenger-pad';
import { createModelAdapter } from '@dxos/model-adapter';
import { ObjectModel } from '@dxos/object-model';
import { TextModel } from '@dxos/text-model';

import Main from './Main';
import { EDITOR_PAD, EDITOR_TYPE_DOCUMENT, EDITOR_TYPE_UPDATE } from './model';

const TextModelAdapter = createModelAdapter(EDITOR_TYPE_UPDATE, TextModel);

export default {
  name: EDITOR_PAD,
  type: EDITOR_TYPE_DOCUMENT,
  contentType: EDITOR_TYPE_UPDATE,
  displayName: 'Documents',
  description: 'Text documents',
  icon: Icon,
  main: Main,
  register: async (client) => {
    await client.registerModel(TextModelAdapter);
  },
  create: async ({ client, party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: EDITOR_TYPE_DOCUMENT,
      props: { title: name || 'untitled' }
    });

    // Adapter for text-model containing document updates.
    await party.database.createItem({
      model: TextModelAdapter,
      type: EDITOR_TYPE_UPDATE,
      parent: item.id
    });

    // Model for in-editor messenger functionality.
    await party.database.createItem({
      model: MessengerModel,
      type: MESSENGER_TYPE_MESSAGE,
      parent: item.id
    });

    return item;
  }
};
