//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';
import { ObjectModel } from '@dxos/echo-db';

export const LIST_TYPE = 'dxos.teamwork.planner.list';

export function useList (topic, viewId) {
  const model = useModel({ model: ObjectModel, options: { type: LIST_TYPE, topic, viewId } });
  return model ?? new ObjectModel();
}
