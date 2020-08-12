//
// Copyright 2020 DXOS.org
//

import { ObjectModel } from '@dxos/echo-db';
import { useModel } from '@dxos/react-client';

export const LIST_TYPE = 'wrn_dxos_org_teamwork_planner_list';
export const CARD_TYPE = 'wrn_dxos_org_teamwork_planner_card';

export function useList (topic, itemId) {
  const model = useModel({ model: ObjectModel, options: { type: [LIST_TYPE, CARD_TYPE], topic, itemId } });
  return model ?? new ObjectModel();
}
