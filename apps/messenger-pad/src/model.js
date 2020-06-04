//
// Copyright 2020 DxOS, Inc.
//

import { useState, useEffect } from 'react';
import assert from 'assert';

import { useModel, useProfile } from '@dxos/react-client';
import { createId } from '@dxos/crypto';
import { DefaultPartiallyOrderedModel } from '@dxos/echodb';

// TODO(burdon): Define types.
export const TYPE_MESSENGER_CHANNEL = 'testing.messenger.Channel';
const TYPE_MESSENGER_MESSAGE = 'testing.messenger.Message';

/**
 * Provides channel list and channel creator.
 * @param {string} topic
 * @returns {[Object[], function]}
 */
export const useChannelList = (topic) => {
  const model = useModel({ options: { type: TYPE_MESSENGER_CHANNEL, topic } });
  if (!model) {
    return [[]];
  }

  // TODO(burdon): CRDT.
  const { messages = [] } = model;
  const channels = Object.values(messages.reduce((map, channel) => {
    map[channel.id] = channel;
    return map;
  }, {}));

  return [
    channels,

    // Create chanel.
    title => {
      const id = createId();
      model.appendMessage({ __type_url: TYPE_MESSENGER_CHANNEL, id, title });
      return id;
    }
  ];
};

/**
 * Provides channel metadata and updater.
 * @param {string} topic
 * @param {string} channelId
 * @returns {[{title}, function]}
 */
export const useChannel = (topic, channelId) => {
  const model = useModel({ options: { type: TYPE_MESSENGER_CHANNEL, topic, id: channelId } });
  if (!model) {
    return [[]];
  }

  // TODO(burdon): CRDT.
  const { messages = [] } = model;
  const { title } = messages.length > 0 ? messages[messages.length - 1] : {};

  return [
    { title },
    ({ title }) => {
      model.appendMessage({ __type_url: TYPE_MESSENGER_CHANNEL, id: channelId, title });
    }
  ];
};

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

  const model = useModel({
    model: DefaultPartiallyOrderedModel,
    options: { type: TYPE_MESSENGER_MESSAGE, topic, channelId }
  });

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (model) {
      model.on('update', () => {
        setMessages(
          [...model.messages]
            .sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0))
        );
      });
    }
  }, [model]);

  return [
    messages,

    text => {
      const id = createId();
      model.appendMessage({
        __type_url: TYPE_MESSENGER_MESSAGE,
        id,
        timestamp: Date.now(),                      // TODO(burdon): Format?
        sender: username,                           // TODO(burdon): Asscoiate with feed (not each message?)
        text,
      });
      return id;
    }
  ];
};
