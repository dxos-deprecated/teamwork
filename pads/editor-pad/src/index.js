//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Description';

import { MessengerModel } from '@dxos/messenger-model';
import { TYPE_MESSENGER_MESSAGE } from '@dxos/messenger-pad';
import { createModelAdapter } from '@dxos/model-adapter';
import { ObjectModel } from '@dxos/object-model';
import { TextModel } from '@dxos/text-model';

import Main from './Main';
import { TYPE_EDITOR_DOCUMENT, TYPE_EDITOR_UPDATE } from './model';

const TextModelAdapter = createModelAdapter(TYPE_EDITOR_UPDATE, TextModel);

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/editor',
  displayName: 'Text Editor',

  icon: Icon,
  main: Main,
  type: TYPE_EDITOR_DOCUMENT,
  contentType: TYPE_EDITOR_UPDATE,
  description: 'Write collaboratively',
  register: async (client) => {
    await client.modelFactory.registerModel(TextModelAdapter);
  },
  create: async ({ client, party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: TYPE_EDITOR_DOCUMENT,
      props: { title: name || 'random-name' }
    });

    // adapter for text-model containing document updates
    await party.database.createItem({
      model: TextModelAdapter,
      type: TYPE_EDITOR_UPDATE,
      parent: item.id
    });

    // model for in-editor messenger functionality
    await party.database.createItem({
      model: MessengerModel,
      type: TYPE_MESSENGER_MESSAGE,
      parent: item.id
    });
    return item;
  }
};
