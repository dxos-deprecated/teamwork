import Icon from '@material-ui/icons/Subject'; // TODO(marik-d) Change

import { TYPE_CANVAS_DOCUMENT } from './model';
import Canvas from './containers/Canvas';

// export * from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/canvas',
  displayName: 'Canvas',

  icon: Icon,
  main: Canvas,
  type: TYPE_CANVAS_DOCUMENT
};
