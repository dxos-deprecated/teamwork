//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/AssignmentTurnedIn';

import { Board } from './containers/Board';
import PlannerSettingsDialog from './containers/PlannerSettingsDialog';
import { BOARD_TYPE } from './model/board';

export { LIST_TYPE, CARD_TYPE } from './model/list';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/board',
  displayName: 'Board',

  icon: Icon,
  main: Board,
  type: BOARD_TYPE,
  description: 'Plan your projects',
  settings: PlannerSettingsDialog
};
