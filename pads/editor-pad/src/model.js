//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';

import { useModel } from '@dxos/react-client';
import { createId } from '@dxos/crypto';

// TODO(burdon): Define types.
export const TYPE_EDITOR_DOCUMENT = 'testing.document.Document';
export const TYPE_EDITOR_UPDATE = 'testing.document.Update';

/**
 * Provides the document content.
 */
export const useDocumentUpdateModel = (topic, documentId) => {
  assert(topic);
  assert(documentId);

  const model = useModel({
    options: { type: TYPE_EDITOR_UPDATE, topic, documentId, disableUpdateHandler: true }
  });

  return model;
};

// TODO(marik-d): Copied from teamwork-app. After item ids are standartized it should be replaced with a hook from appkit.

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
