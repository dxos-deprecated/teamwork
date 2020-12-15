//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Description';

import { MessengerModel, MESSENGER_TYPE_MESSAGE } from '@dxos/messenger-model';
import { ObjectModel } from '@dxos/object-model';
import { TextModel } from '@dxos/text-model';

import Main from './Main';
import { EDITOR_PAD, EDITOR_TYPE_DOCUMENT, EDITOR_TYPE_CONTENT } from './model';

export default {
  name: EDITOR_PAD,
  type: EDITOR_TYPE_DOCUMENT,
  contentType: EDITOR_TYPE_CONTENT,
  displayName: 'Documents',
  description: 'Text documents',
  icon: Icon,
  main: Main,
  register: async (client) => {
    await client.registerModel(TextModel);
  },
  create: async ({ party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: EDITOR_TYPE_DOCUMENT,
      props: { title: name || 'untitled' }
    });

    // Adapter for text-model containing document updates.
    await party.database.createItem({
      model: TextModel,
      type: EDITOR_TYPE_CONTENT,
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
