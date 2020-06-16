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
  viewId?: string
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
    map[item.viewId ?? item.objectId!] = item;
    return map;
  }, {} as Record<string, Item>));

  return {
    items,
    createItem: (opts: any) => {
      const viewId = createId();
      const objectId = createObjectId(opts.__type_url, viewId);
      model.appendMessage({ viewId, objectId, ...opts });
      return viewId;
    },
    editItem: (opts: any) => {
      const objectId = createObjectId(opts.__type_url, opts.itemId);
      model.appendMessage({ objectId, ...opts });
    }
  };
};

/**
 * Provides item metadata and updater.
 * @returns {[{title}, function]}
 */
export const useItem = (topic: string, types: string[], viewId: string | undefined): [Item | undefined, (opts: { title: string }) => void] => {
  const model = useModel({ options: { type: types, topic, viewId } });
  if (!model || !viewId) {
    return [undefined, () => {}];
  }

  // TODO(burdon): CRDT.
  const messages: Item[] = model?.messages ?? [];
  const item = messages.length > 0 ? messages[messages.length - 1] : undefined;
  const type = messages[0]?.['__type_url'];

  return [
    item,
    ({ title }: { title: string }) => {
      const objectId = createObjectId(type, viewId);
      model.appendMessage({ __type_url: type, viewId, objectId, title });
    }
  ];
};
