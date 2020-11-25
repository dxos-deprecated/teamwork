//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { humanize, PublicKey } from '@dxos/crypto';
import { MESSENGER_TYPE_MESSAGE } from '@dxos/messenger-model';
import { useItems, useProfile } from '@dxos/react-client';

/**
 * Provides channel messages and appender.
 * @param topic
 * @param channelId
 * @returns {[Object[], function]}
 */
export const useChannelMessages = (topic, channelId) => {
  assert(topic);
  assert(channelId);
  const profile = useProfile();

  const [messenger] = useItems({ partyKey: PublicKey.from(topic), parent: channelId, type: MESSENGER_TYPE_MESSAGE });

  if (!messenger) {
    return [[], () => {}];
  }
  return [messenger.model.messages, text => {
    messenger.model.sendMessage({
      text,
      sender: profile.username || humanize(profile.publicKey.toString())
    });
  }];
};
