import { useModel } from '@dxos/react-client';
import { createId } from '@dxos/crypto';

/**
 * Provides item list and item creator.
 * @param {string} topic
 * @param {string[]} types
 * @returns {[Object[], function]}
 */
export const useItemList = (topic, types) => {
  const model = useModel({ options: { type: types, topic } });

  // TODO(burdon): CRDT.
  const messages = model?.messages ?? [];
  const items = Object.values(messages.reduce((map, item) => {
    map[item.itemId] = item;
    return map;
  }, {}));

  return {
    items,
    createItem: opts => {
      const itemId = createId();
      model.appendMessage({ itemId, ...opts });
      return itemId;
    },
    editItem: (itemId, opts) => {
      model.appendMessage({ itemId, ...opts });
    },
  };
};

/**
 * Provides item metadata and updater.
 * @param {string} topic
 * @param {string} type
 * @param {string} itemId
 * @returns {[{title}, function]}
 */
export const useItem = (topic, type, itemId) => {
  const model = useModel({ options: { type, topic, itemId } });
  if (!model) {
    return [[]];
  }

  // TODO(burdon): CRDT.
  const { messages = [] } = model;
  const { title } = messages.length > 0 ? messages[messages.length - 1] : {};

  return [
    { title },
    ({ title }) => {
      model.appendMessage({ __type_url: type, itemId, title });
    }
  ];
};
