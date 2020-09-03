//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/BugReport';

import { Main } from './Main';
import { TYPE_TESTING_PAD, TYPE_TESTING_ITEM } from './model';

export * from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/testing',
  displayName: 'Testing',

  icon: Icon,
  main: Main,
  type: TYPE_TESTING_PAD,
  contentType: TYPE_TESTING_ITEM,
  description: 'DXOS demos & tests'
};
