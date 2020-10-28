//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/CheckBoxOutlined';

import { ObjectModel } from '@dxos/object-model';

import { Main } from './Main';
import { TASKS_PAD, TASKS_TYPE_LIST, TASKS_TYPE_TASK } from './model';

export * from './model';

export default {
  name: TASKS_PAD,
  type: TASKS_TYPE_LIST,
  contentType: TASKS_TYPE_TASK,
  displayName: 'Tasks',
  description: 'Task list',
  icon: Icon,
  main: Main,
  create: async ({ party }, { name }) => {
    return await party.database.createItem({
      model: ObjectModel,
      type: TASKS_TYPE_LIST,
      props: { title: name || 'untitled' }
    });
  }
};
