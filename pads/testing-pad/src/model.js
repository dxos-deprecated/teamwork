//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { ObjectModel } from '@dxos/echo-db';
import { useModel } from '@dxos/react-client';

export const TYPE_TESTING_PAD = 'dxos.teamwork.testing.Pad';
export const TYPE_TESTING_ITEM = 'dxos.teamwork.testing.Item';

/**
 * Provides item list and item creator.
 * @returns {ViewModel}
 */
export const useItems = (topic, viewId) => {
  const model = useModel({ model: ObjectModel, options: { type: TYPE_TESTING_ITEM, topic, viewId } });
  const objects = model?.getObjectsByType(TYPE_TESTING_ITEM) ?? [];

  return {
    model,
    objects,
    createItem: (item) => {
      assert(model);
      model.createItem(TYPE_TESTING_ITEM, item);
    }
  };
};
