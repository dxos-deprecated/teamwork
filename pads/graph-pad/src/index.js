//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/BubbleChart';

import { ObjectModel } from '@dxos/object-model';

import { Main } from './Main';
import { GRAPH_PAD } from './model';

export * from './model';

export default {
  name: GRAPH_PAD,
  type: GRAPH_PAD,
  contentType: GRAPH_PAD,
  displayName: 'Graph',
  description: 'Graph structure',
  icon: Icon,
  main: Main,
  create: async ({ party }, { name }) => {
    return await party.database.createItem({
      model: ObjectModel,
      type: GRAPH_PAD,
      props: { title: name || 'untitled' }
    });
  }
};
