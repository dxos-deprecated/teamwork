//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/ViewColumn';

import { ObjectModel } from '@dxos/object-model';

import { Main } from './Main';
import { TABLE_PAD, TABLE_TYPE_TABLE, TABLE_TYPE_RECORD } from './model';

export * from './model';

export default {
  name: TABLE_PAD,
  type: TABLE_TYPE_TABLE,
  contentType: TABLE_TYPE_RECORD,
  displayName: 'Table',
  description: 'Tabular data',
  icon: Icon,
  main: Main,
  register: async (client) => {
    await client.registerModel(ObjectModel);
  },
  create: async ({ party }, { name }) => {
    return await party.database.createItem({
      model: ObjectModel,
      type: TABLE_TYPE_TABLE,
      props: { title: name || 'untitled' }
    });
  }
};
