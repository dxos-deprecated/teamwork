//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { createId, humanize, keyToBuffer } from '@dxos/crypto';
import { MessengerModel } from '@dxos/messenger-model';
import { useItems, useProfile, useClient } from '@dxos/react-client';

export const TYPE_MESSENGER_CHANNEL = 'wrn_dxos_org_teamwork_messenger_channel';
export const TYPE_MESSENGER_MESSAGE = 'wrn_dxos_org_teamwork_messenger_message';

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
  client.modelFactory.registerModel(MessengerModel);
  const [messenger] = useItems({ partyKey: keyToBuffer(topic), parent: channelId, type: TYPE_MESSENGER_MESSAGE });

  if (!messenger) return [[], () => {}];
  return [messenger.model.messages, text => {
    messenger.model.sendMessage({
      id: createId(),
      text,
      sender: humanize(username),
      timestamp: Date.now().toString()
    });
  }];
};
