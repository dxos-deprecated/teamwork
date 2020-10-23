//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/AssignmentTurnedIn';

import { ObjectModel } from '@dxos/object-model';

import { Board } from './containers/Board';
import PlannerSettingsDialog from './containers/PlannerSettingsDialog';
import { BOARD_TYPE, LIST_TYPE, CARD_TYPE } from './model';
export { BOARD_TYPE, LIST_TYPE, CARD_TYPE } from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/board',
  displayName: 'Board',

  icon: Icon,
  main: Board,
  type: BOARD_TYPE,
  contentType: [LIST_TYPE, CARD_TYPE],
  description: 'Plan your projects',
  settings: PlannerSettingsDialog,
  create: async ({ party }, { name }, { description }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: BOARD_TYPE,
      props: { title: name || 'untitled' }
    });
    await item.model.setProperty('description', description || '');

    await party.database.createItem({
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
    return item;
  }
};
