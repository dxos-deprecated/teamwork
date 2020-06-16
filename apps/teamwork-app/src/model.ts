//
// Copyright 2020 DxOS, Inc.
//

import { useModel } from '@dxos/react-client';
import { createId } from '@dxos/crypto';

export interface Item {
  __type_url: string
  title: string
  viewId: string
}

/**
 * Provides item list and item creator.
 */
export const useItemList = (topic: string, types: string[]) => {
  const model = useModel({ options: { type: types, topic } });

  // TODO(burdon): CRDT. (maybe use PartiallyOrderedModel?)
  const messages: Item[] = model?.messages ?? [];
  const items = Object.values(messages.reduce((map, item) => {
    map[item.viewId] = { ...(map[item.viewId] || []), ...item };
    return map;
  }, {} as Record<string, Item>));

  return {
    items,
    createItem: (type: string, title: string, opts = {}) => {
      const viewId = createId();
      model.appendMessage({ viewId, __type_url: type, title, ...opts });
      return viewId;
    },
    editItem: (type: string, viewId: string, title: string) => {
      model.appendMessage({ __type_url: type, viewId, title });
    }
  };
};

/**
 * Provides item metadata and updater.
 * @returns {[{title}, function]}
 */
export const useItem = (topic: string, types: string[], viewId: string | undefined): [Item | undefined, (title: string) => void] => {
  const model = useModel({ options: { type: types, topic, viewId } });
  if (!model || !viewId) {
    return [undefined, () => {}];
  }

  // TODO(burdon): CRDT.
  if (!model?.messages?.length) {
    return [undefined, () => {}];
  }
  const item: Item = Object.assign({}, ...model?.messages);
  const type = item.__type_url;

  return [
    item,
    (title: string) => {
      model.appendMessage({ __type_url: type, viewId, title });
    }
  ];
};
