//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';
import { ViewModel } from '@dxos/view-model';

/**
 * Provides item list and item creator.
 * @returns {ViewModel}
 */
export const useItems = (topic) => {
  const model = useModel({ model: ViewModel, options: { type: '__TASKS_TYPE__', topic } });
  return model ?? new ViewModel(); // while model is loading, we have an empty list
};
