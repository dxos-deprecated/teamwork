//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';

import { ArrayModel } from './array';

export const useArrayModel = (topic, type, options = {}) => useModel({
  model: ArrayModel,
  options: {
    type,
    topic,
    ...options
  }
});
