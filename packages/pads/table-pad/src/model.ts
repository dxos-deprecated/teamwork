//
// Copyright 2020 DXOS.org
//

import { Party } from '@dxos/echo-db';
import { ObjectModel } from '@dxos/object-model';

export const TABLE_PAD = 'dxos.org/pad/table';
export const TABLE_TYPE_TABLE = 'dxos.org/type/table/table';
export const TABLE_TYPE_RECORD = 'dxos.org/type/table/record';

export const createRecord = async (
  { party, itemId }: {party: Party, itemId: string},
  props: Record<string, any>
) => {
  return await party.database.createItem({
    model: ObjectModel,
    type: TABLE_TYPE_RECORD,
    parent: itemId,
    props
  });
};
