//
// Copyright 2020 DXOS.org
//

import { ObjectModel } from '@dxos/object-model';

export const TYPE_TODO_PAD = 'wrn_dxos_org_teamwork_todo_pad';
export const TYPE_TODO_ITEM = 'wrn_dxos_org_teamwork_todo_item';

export const addTask = async (party, { text, completed = false }) => {
  await party.database.createItem({
    model: ObjectModel,
    type: TYPE_TODO_PAD,
    props: {
      text,
      completed
    }
  });
};
