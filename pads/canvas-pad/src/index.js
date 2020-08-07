//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Brush';

import { Canvas } from './Canvas';
import { TYPE_CANVAS_DOCUMENT } from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/canvas',
  displayName: 'Canvas',

  icon: Icon,
  main: Canvas,
  type: TYPE_CANVAS_DOCUMENT,
  description: 'Draw collaboratively'
};
