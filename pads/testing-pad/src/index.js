//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/BugReport';

import { Main } from './Main';
import { TESTING_PAD, TESTING_TYPE_ITEMS, TESTING_TYPE_ITEM } from './model';

export * from './model';

export default {
  name: TESTING_PAD,
  type: TESTING_TYPE_ITEMS,
  contentType: TESTING_TYPE_ITEM,
  displayName: 'Testing',
  description: 'Testing pad',
  icon: Icon,
  main: Main
};
