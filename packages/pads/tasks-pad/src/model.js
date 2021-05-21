//
// Copyright 2020 DXOS.org
//

import { ObjectModel } from '@dxos/object-model';

export const TASKS_PAD = 'dxos.org/pad/tasks';
export const TASKS_TYPE_LIST = 'dxos.org/type/tasks/list';
export const TASKS_TYPE_TASK = 'dxos.org/type/tasks/task';

export const createTask = async ({ party, itemId }, { text, completed = false }) => {
  return await party.database.createItem({
    model: ObjectModel,
    type: TASKS_TYPE_TASK,
    parent: itemId,
    props: {
      text,
      completed
    }
  });
};
