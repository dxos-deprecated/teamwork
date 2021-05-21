//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Brush';

import { Client } from '@dxos/client';
import { Party } from '@dxos/echo-db';
import { ObjectModel } from '@dxos/object-model';

import { Canvas } from './Canvas';
import { CANVAS_PAD, CANVAS_TYPE_DIAGRAM, CANVAS_TYPE_OBJECT } from './model';

export * from './model';

export default {
  name: CANVAS_PAD,
  type: CANVAS_TYPE_DIAGRAM,
  contentType: CANVAS_TYPE_OBJECT,
  displayName: 'Canvas',
  description: 'Technical diagrams',
  icon: Icon,
  main: Canvas,
  register: async (client: Client) => {
    await client.registerModel(ObjectModel);
  },
  create: async (
    { party }: {party: Party},
    { name }: {name?: string}
  ) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: CANVAS_TYPE_DIAGRAM,
      props: { title: name || 'untitled' }
    });

    return item;
  }
};
