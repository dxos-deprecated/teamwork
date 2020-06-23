//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';
import { ViewModel } from '@dxos/view-model';
import { usePads } from '@dxos/react-appkit';

/**
 * Provides item list and item creator.
 * @returns {ViewModel}
 */
export const useItems = (topic) => {
  const [pads] = usePads();
  const model = useModel({ model: ViewModel, options: { type: pads.map(pad => pad.type), topic } });
  return model ?? new ViewModel(); // hack to ensure we dont have any crashes while model is loading
};
