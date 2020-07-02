//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Chat';

import { Main } from './Main';
import { TYPE_TESTING_PAD } from './model';

export * from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/testing',
  displayName: 'Testing',

  icon: Icon,
  main: Main,
  type: TYPE_TESTING_PAD,
  description: 'DXOS demos & tests'
};
