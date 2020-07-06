//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';
import { ObjectModel } from '@dxos/echo-db';

export const CARD_TYPE = 'dxos.teamwork.planner.card';

export function useCard (topic, listId) {
  const model = useModel({ model: ObjectModel, options: { type: CARD_TYPE, topic, listId } });
  return model ?? new ObjectModel();
}
