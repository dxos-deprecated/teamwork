//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';
import { ObjectModel } from '@dxos/echo-db';

export const LIST_TYPE = 'wrn_dxos_org_teamwork_planner_list';
export const CARD_TYPE = 'wrn_dxos_org_teamwork_planner_card';

export function useList (topic, viewId) {
  const model = useModel({ model: ObjectModel, options: { type: [LIST_TYPE, CARD_TYPE], topic, viewId } });
  return model ?? new ObjectModel();
}
