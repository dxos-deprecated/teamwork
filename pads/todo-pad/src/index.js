//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/CheckBoxOutlined';

import { ObjectModel } from '@dxos/object-model';

import { Main } from './Main';
import { TYPE_TODO_PAD, TYPE_TODO_ITEM, addTask } from './model';

export * from './model';

export default {
  name: 'example.com/todo',
  displayName: 'Todo',

  icon: Icon,
  main: Main,
  type: TYPE_TODO_PAD,
  contentType: TYPE_TODO_ITEM,
  description: 'DXOS simple todo list',
  create: async ({ party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: TYPE_TODO_PAD,
      props: { title: name || 'untitled' }
    });
    await addTask({ party, itemId: item.id }, { completed: true, text: 'Completed task' });
    await addTask({ party, itemId: item.id }, { completed: false, text: 'Outstanding task' });
    return item;
  }
};
