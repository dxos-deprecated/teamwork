//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { createId, humanize, keyToBuffer } from '@dxos/crypto';
import { MessengerModel } from '@dxos/messenger-model';
import { useItems, useProfile, useClient } from '@dxos/react-client';

export const MESSENGER_PAD = 'dxos.org/pad/messenger';
export const MESSENGER_TYPE_CHANNEL = 'dxos.org/type/messenger/channel';
export const MESSENGER_TYPE_MESSAGE = 'dxos.org/type/messenger/message';

/**
 * Provides channel messages and appender.
 * @param topic
 * @param channelId
 * @returns {[Object[], function]}
 */
export const useChannelMessages = (topic, channelId) => {
  assert(topic);
  assert(channelId);
  const { username } = useProfile();
  const client = useClient();
  client.registerModel(MessengerModel);
  const [messenger] = useItems({ partyKey: keyToBuffer(topic), parent: channelId, type: MESSENGER_TYPE_MESSAGE });

  if (!messenger) {
    return [[], () => {}];
  }

  return [messenger.model.messages, text => {
    messenger.model.sendMessage({
      id: createId(),
      text,
      sender: humanize(username),
      timestamp: Date.now().toString()
    });
  }];
};
