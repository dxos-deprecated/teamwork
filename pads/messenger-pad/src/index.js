//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Chat';

import { Channel, MessengerSettingsDialog } from './containers';
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
  description: 'Chat with friends'
  // settings: MessengerSettingsDialog
};
