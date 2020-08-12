//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { ObjectModel } from '@dxos/echo-db';
import { useModel } from '@dxos/react-client';

export const TYPE_TESTING_PAD = 'wrn_dxos_org_teamwork_testing_pad';
export const TYPE_TESTING_ITEM = 'wrn_dxos_org_teamwork_testing_item';

/**
 * Provides item list and item creator.
 * @returns {ItemModel}
 */
export const useItems = (topic, itemId) => {
  const model = useModel({ model: ObjectModel, options: { type: TYPE_TESTING_ITEM, topic, itemId } });
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
