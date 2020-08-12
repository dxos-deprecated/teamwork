//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { ObjectModel } from '@dxos/echo-db';
import { useModel } from '@dxos/react-client';

// TODO(burdon): Standardize "document" for all apps (or item?)
export const TYPE_CANVAS_DOCUMENT = 'wrn_dxos_org_teamwork_canvas_document';
export const TYPE_CANVAS_ECHO_OBJECT = 'wrn_dxos_org_teamwork_canvas_object';

// TODO(burdon): Replace.
const fromSafeId = (id) => id.replace('__', '/');

/**
 * Document state.
 *
 * @param topic
 * @param itemId
 * @returns {{ objects: Object[] }}
 */
export const useDocument = (topic, itemId) => {
  assert(topic);
  assert(itemId);

  // TODO(burdon): Why do we specify type in createItem AND here?
  const model = useModel({
    model: ObjectModel,
    options: {
      type: TYPE_CANVAS_ECHO_OBJECT,
      topic,
      itemId: fromSafeId(itemId)
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
