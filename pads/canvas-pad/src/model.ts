//
// Copyright 2020 DxOS, Inc.
//

import assert from 'assert';

import { EchoModel } from '@dxos/echo-db';
import { useModel } from '@dxos/react-client';

// TODO(burdon): Slashes not allowed.
// TODO(burdon): Standardize "document" for all apps (or item?)
export const TYPE_CANVAS_DOCUMENT = 'wrn_dxos_org_canvas_echo_document';
export const TYPE_CANVAS_ECHO_OBJECT = 'wrn_dxos_org_canvas_echo_object';

// TODO(burdon): Replace.
const fromSafeId = (id: string) => id.replace('__', '/');

/**
 * Document state.
 *
 * @param topic
 * @param documentId
 * @returns {{ objects: Object[] }}
 */
export const useDocument = (topic: string, documentId: string) => {
  assert(topic);
  assert(documentId);

  // TODO(burdon): Why do we specify type in createItem AND here?
  const model = useModel({
    model: EchoModel,
    options: {
      type: TYPE_CANVAS_ECHO_OBJECT,
      topic,
      documentId: fromSafeId(documentId)
    }
  });

  return {
    objects: model?.getObjectsByType(TYPE_CANVAS_ECHO_OBJECT) ?? [],

    createObject: (properties: any) => {
      assert(model);
      return model.createItem(TYPE_CANVAS_ECHO_OBJECT, properties);
    },

    updateObject: (id: string, properties: any) => {
      assert(model);
      model.updateItem(id, properties);
    },

    deleteObject: (id: string) => {
      assert(model);
      model.deleteItem(id);
    }
  };
};
