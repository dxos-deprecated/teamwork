//
// Copyright 2020 DxOS, Inc.
//

import { useModel } from '@dxos/react-client';
import { ViewModel, View } from '@dxos/echo-db';
import { usePads } from '@dxos/react-appkit';
import { Pad } from './common';

/**
 * Provides item list and item creator.
 */
export const useViewList = <T extends View = View> (topic: string): ViewModel<T> => {
  const [pads]: Pad[][] = usePads();

  return useModel({ model: ViewModel, options: { type: pads.map(pad => pad.type), topic } }) ??
    new ViewModel(); // TODO(marik-d): a hack for the case where `useModel` can return null initially
};
