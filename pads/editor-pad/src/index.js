//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Description';

import Main from './Main';
import { TYPE_EDITOR_DOCUMENT, TYPE_EDITOR_UPDATE } from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/editor',
  displayName: 'Text Editor',

  icon: Icon,
  main: Main,
  type: TYPE_EDITOR_DOCUMENT,
  contentType: TYPE_EDITOR_UPDATE,
  description: 'Write collaboratively'
};
