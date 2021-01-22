//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/AssignmentTurnedIn';

import { Client } from '@dxos/client';
import { Party } from '@dxos/echo-db';
import { ObjectModel } from '@dxos/object-model';

import { Board } from './containers/Board';
import PlannerSettingsDialog from './containers/PlannerSettingsDialog';
import { PLANNER_PAD, PLANNER_TYPE_BOARD, PLANNER_TYPE_LIST, PLANNER_TYPE_CARD } from './model';

export * from './model';

export default {
  name: PLANNER_PAD,
  type: PLANNER_TYPE_BOARD,
  contentType: [PLANNER_TYPE_LIST, PLANNER_TYPE_CARD],
  displayName: 'Board',
  description: 'Project kanban',
  icon: Icon,
  main: Board,
  settings: PlannerSettingsDialog,
  register: async (client: Client) => {
    await client.registerModel(ObjectModel);
  },
  create: async (
    { party }: {party: Party},
    { name }: {name?: string},
    { description = '' } = {}
  ) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: PLANNER_TYPE_BOARD,
      props: { title: name || 'untitled' }
    });
    await item.model.setProperty('description', description || '');

    // TODO(burdon): Create array.
    await party.database.createItem({
      model: ObjectModel,
      type: PLANNER_TYPE_LIST,
      parent: item.id,
      props: { title: 'Icebox', position: 0 }
    });
    await party.database.createItem({
      model: ObjectModel,
      type: PLANNER_TYPE_LIST,
      parent: item.id,
      props: { title: 'Started', position: 1 }
    });
    await party.database.createItem({
      model: ObjectModel,
      type: PLANNER_TYPE_LIST,
      parent: item.id,
      props: { title: 'Done', position: 2 }
    });

    return item;
  }
};
