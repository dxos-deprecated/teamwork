//
// Copyright 2020 DxOS, Inc.
//

import { useModel } from '@dxos/react-client';
import { createId } from '@dxos/crypto';
import { createObjectId } from '@dxos/echo-db';

export interface Item {
  ['__type_url']: string
  title: string

  // TODO(rzadp) - canvas uses objectId instead of itemId. If we change this than we can have itemId as non-optional property
  itemId?: string
  objectId?: string
}

/**
 * Provides item list and item creator.
 */
export const useItemList = (topic: string, types: string[]) => {
  const model = useModel({ options: { type: types, topic } });

  // TODO(burdon): CRDT.
  const messages: Item[] = model?.messages ?? [];
  const items = Object.values(messages.reduce((map, item) => {
    map[item.itemId ?? item.objectId!] = item;
    return map;
  }, {} as Record<string, Item>));

  return {
    items,
    createItem: (opts: any) => {
      const itemId = createId();
      const objectId = createObjectId(opts.__type_url, itemId);
      model.appendMessage({ itemId, objectId, ...opts });
      return itemId;
    },
    editItem: (opts: any) => {
      model.appendMessage(opts);
    }
  };
};

/**
 * Provides item metadata and updater.
 * @returns {[{title}, function]}
 */
export const useItem = (topic: string, types: string[], itemId: string | undefined): [Item | undefined, (opts: { title: string }) => void] => {
  const model = useModel({ options: { type: types, topic, itemId } });
  if (!model || !itemId) {
    return [undefined, () => {}];
  }

  // TODO(burdon): CRDT.
  const messages: Item[] = model?.messages ?? [];
  const item = messages.length > 0 ? messages[messages.length - 1] : undefined;
  const type = messages[0]?.['__type_url'];

  return [
    item,
    ({ title }: { title: string }) => {
      model.appendMessage({ __type_url: type, itemId, title });
    }
  ];
};
