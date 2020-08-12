//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';
import { ItemModel } from '@dxos/view-model';

export const BOARD_TYPE = 'wrn_dxos_org_teamwork_planner_board';

/**
 *
 * @returns {ItemModel<{ description: string }>}
 */
export function useItems (topic, itemId) {
  const model = useModel({ model: ItemModel, options: { type: BOARD_TYPE, topic, itemId } });
  return model ?? new ItemModel();
}
