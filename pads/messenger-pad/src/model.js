//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { Chance } from 'chance';
import { useState, useEffect } from 'react';

import { createId } from '@dxos/crypto';
import { DefaultPartiallyOrderedModel } from '@dxos/echo-db';
import { usePads } from '@dxos/react-appkit';
import { useModel, useProfile } from '@dxos/react-client';
import { ItemModel } from '@dxos/view-model';

export const TYPE_MESSENGER_CHANNEL = 'wrn_dxos_org_teamwork_messenger_channel';
export const TYPE_MESSENGER_MESSAGE = 'wrn_dxos_org_teamwork_messenger_message';

const chance = new Chance();

const messagesSort = (a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);

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
      const update = () => setMessages([...model.messages].sort(messagesSort));
      update();
      model.on('update', update);
    }
  }, [model]);

  return [
    messages,

    text => {
      const id = createId();
      model.appendMessage({
        __type_url: TYPE_MESSENGER_MESSAGE,
        id,
        timestamp: Date.now(), // TODO(burdon): Format?
        sender: username, // TODO(burdon): Asscoiate with feed (not each message?)
        text
      });
      return id;
    }
  ];
};

/**
 * Provides item list and item creator.
 * @returns {ItemModel}
 */
export const useItems = (topic) => {
  const [pads] = usePads();
  const model = useModel({ model: ItemModel, options: { type: pads.map(pad => pad.type), topic } });

  return {
    items: model?.getAllItems() ?? [],
    createItem: (type) => {
      assert(model);
      assert(type);
      const displayName = `embeded-item-${chance.word()}`;
      const itemId = model.createItem(type, displayName);
      return { __type_url: type, itemId, displayName };
    }
  };
};