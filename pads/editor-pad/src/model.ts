//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';

import { useModel } from '@dxos/react-client';
import { createId } from '@dxos/crypto';
import { createObjectId } from '@dxos/echo-db';

// TODO(burdon): Define types.
export const TYPE_EDITOR_DOCUMENT = 'testing.document.Document';
export const TYPE_EDITOR_UPDATE = 'testing.document.Update';

/**
 * Provides the document content.
 */
export const useDocumentUpdateModel = (topic: string, documentId: string): any => {
  assert(topic);
  assert(documentId);

  const model = useModel({
    options: { type: TYPE_EDITOR_UPDATE, topic, documentId, disableUpdateHandler: true }
  });

  return model;
};

// TODO(marik-d): Copied from teamwork-app. After item ids are standartized it should be replaced with a hook from appkit.

export interface Item {
  ['__type_url']: string
  viewId: string
  title: string
}

/**
 * Provides item list and item creator.
 */
export const useItemList = (topic: string, types: string[]) => {
  const model = useModel({ options: { type: types, topic } });

  // TODO(burdon): CRDT.
  const messages: Item[] = model?.messages ?? [];
  const items = Object.values(messages.reduce((map, item) => {
    map[item.viewId] = item;
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
      model.appendMessage(opts);
    }
  };
};
