//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/AssignmentTurnedIn';

import { ObjectModel } from '@dxos/object-model';

import { Board } from './containers/Board';
// import PlannerSettingsDialog from './containers/PlannerSettingsDialog';
import { BOARD_TYPE } from './model/board';
import { LIST_TYPE, CARD_TYPE } from './model/list';
export { LIST_TYPE, CARD_TYPE } from './model/list';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/board',
  displayName: 'Board',

  icon: Icon,
  main: Board,
  type: BOARD_TYPE,
  contentType: [LIST_TYPE, CARD_TYPE],
  description: 'Plan your projects',
  // settings: PlannerSettingsDialog,
  create: async ({ party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: BOARD_TYPE,
      props: { title: name || 'untitled' }
    });

    const todoList = await party.database.createItem({
      model: ObjectModel,
      type: LIST_TYPE,
      parent: item.id,
      props: { title: 'TODO', position: 0 }
    });
    await party.database.createItem({
      model: ObjectModel,
      type: LIST_TYPE,
      parent: item.id,
      props: { title: 'In Progress', position: 1 }
    });
    await party.database.createItem({
      model: ObjectModel,
      type: LIST_TYPE,
      parent: item.id,
      props: { title: 'Done', position: 2 }
    });

    await party.database.createItem({
      model: ObjectModel,
      type: CARD_TYPE,
      parent: item.id,
      props: { title: 'First task', position: 0, listId: todoList.id }
    });
    return item.id;
  }
};
