//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Chat';

import { MessengerModel } from '@dxos/messenger-model';
import { ObjectModel } from '@dxos/object-model';

import { Channel } from './containers';
import { TYPE_MESSENGER_CHANNEL, TYPE_MESSENGER_MESSAGE } from './model';

export * from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/messenger',
  displayName: 'Messenger',

  icon: Icon,
  main: Channel,
  type: TYPE_MESSENGER_CHANNEL,
  contentType: TYPE_MESSENGER_MESSAGE,
  description: 'Chat with friends',
  // settings: MessengerSettingsDialog
  register: async (client) => {
    await client.modelFactory.registerModel(MessengerModel);
  },
  create: async ({ client, party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: TYPE_MESSENGER_CHANNEL,
      props: { title: name || 'random-name' }
    });
    await party.database.createItem({
      model: MessengerModel,
      parent: item.id
    });
    return item.id;
  }
};
