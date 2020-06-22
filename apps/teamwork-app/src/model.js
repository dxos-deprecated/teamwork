//
// Copyright 2020 DxOS, Inc.
//

import { useModel } from '@dxos/react-client';
import { createId } from '@dxos/crypto';

/**
 * Provides item list and item creator.
 */
export const useItemList = (topic, types) => {
  const model = useModel({ options: { type: types, topic } });

  // TODO(burdon): CRDT. (maybe use PartiallyOrderedModel?)
  const messages = model?.messages ?? [];
  const items = Object.values(messages.reduce((map, item) => {
    map[item.viewId] = { ...(map[item.viewId] || []), ...item };
    return map;
  }, {}));

  return {
    items,
    createItem: (type, title, opts = {}) => {
      const viewId = createId();
      model.appendMessage({ viewId, __type_url: type, title, ...opts });
      return viewId;
    },
    editItem: (type, viewId, title) => {
      model.appendMessage({ __type_url: type, viewId, title });
    }
  };
};

/**
 * Provides item metadata and updater.
 * @returns {[{title}, function]}
 */
export const useItem = (topic, types, viewId) => {
  const model = useModel({ options: { type: types, topic, viewId } });
  if (!model || !viewId) {
    return [undefined, () => {}];
  }

  // TODO(burdon): CRDT.
  if (!model?.messages?.length) {
    return [undefined, () => {}];
  }
  const item = Object.assign({}, ...model?.messages);
  const type = item.__type_url;

  return [
    item,
    (title) => {
      model.appendMessage({ __type_url: type, viewId, title });
    }
  ];
};
