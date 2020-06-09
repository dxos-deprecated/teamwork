import Icon from '@material-ui/icons/Subject'; // TODO(marik-d) Change

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
