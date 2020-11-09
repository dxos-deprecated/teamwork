//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { createId, humanize, keyToBuffer } from '@dxos/crypto';
import { useItems, useProfile } from '@dxos/react-client';

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
  const partyKey = keyToBuffer(topic);
  const profile = useProfile();

  const [messenger] = useItems({ partyKey, parent: channelId, type: MESSENGER_TYPE_MESSAGE });

  if (!messenger) {
    return [[], () => {}];
  }
  return [messenger.model.messages, text => {
    messenger.model.sendMessage({
      text,
      sender: profile.username || humanize(profile.publicKey)
    });
  }];
};
