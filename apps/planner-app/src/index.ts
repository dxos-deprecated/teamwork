import Icon from '@material-ui/icons/AssignmentTurnedIn';

import Board, { BOARD_TYPE } from './containers/Board';

// export * from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/board',
  displayName: 'Board',

  icon: Icon,
  main: Board,
  type: BOARD_TYPE
};
