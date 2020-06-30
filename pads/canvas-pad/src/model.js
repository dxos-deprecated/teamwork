//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { ObjectModel } from '@dxos/echo-db';
import { useModel } from '@dxos/react-client';

// TODO(burdon): Slashes not allowed.
// TODO(burdon): Standardize "document" for all apps (or item?)
export const TYPE_CANVAS_DOCUMENT = 'wrn_dxos_org_canvas_echo_document';
export const TYPE_CANVAS_ECHO_OBJECT = 'wrn_dxos_org_canvas_echo_object';

// TODO(burdon): Replace.
const fromSafeId = (id) => id.replace('__', '/');

/**
 * Document state.
 *
 * @param topic
 * @param documentId
 * @returns {{ objects: Object[] }}
 */
export const useDocument = (topic, documentId) => {
  assert(topic);
  assert(documentId);

  // TODO(burdon): Why do we specify type in createItem AND here?
  const model = useModel({
    model: ObjectModel,
    options: {
      type: TYPE_CANVAS_ECHO_OBJECT,
      topic,
      documentId: fromSafeId(documentId)
    }
  });

  return {
    objects: model?.getObjectsByType(TYPE_CANVAS_ECHO_OBJECT) ?? [],

    createObject: (properties) => {
      assert(model);
      return model.createItem(TYPE_CANVAS_ECHO_OBJECT, properties);
    },

    updateObject: (id, properties) => {
      assert(model);
      model.updateItem(id, properties);
    },

    deleteObject: (id) => {
      assert(model);
      model.deleteItem(id);
    }
  };
};
