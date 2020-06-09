import Icon from '@material-ui/icons/Description';

import Main from './Main';
import { TYPE_EDITOR_DOCUMENT } from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/editor',
  displayName: 'Text Editor',

  icon: Icon,
  main: Main,
  type: TYPE_EDITOR_DOCUMENT
};
