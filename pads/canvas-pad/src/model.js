//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { keyToBuffer } from '@dxos/crypto';
import { ObjectModel } from '@dxos/object-model';
import { useModel, useItems } from '@dxos/react-client';

export const CANVAS_PAD = 'dxos.org/pad/canvas';
export const CANVAS_TYPE_DIAGRAM = 'dxos.org/type/canvas/diagram';
export const CANVAS_TYPE_OBJECT = 'dxos.org/type/canvas/object';

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
      type: CANVAS_TYPE_OBJECT,
      topic,
      itemId: fromSafeId(itemId)
    }
  });

  return {
    objects: model?.getObjectsByType(CANVAS_TYPE_OBJECT) ?? [],

    createObject: (properties) => {
      assert(model);
      return model.createItem(CANVAS_TYPE_OBJECT, properties);
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

export const useCanvasModel = (topic, itemId) => {
  assert(topic);
  assert(itemId);

  const canvasObjects = useItems({ partyKey: keyToBuffer(topic), parent: itemId, type: CANVAS_TYPE_OBJECT });

  return canvasObjects;
};
