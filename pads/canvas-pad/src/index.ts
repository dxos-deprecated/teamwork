//
// Copyright 2020 DxOS, Inc.
//

import Icon from '@material-ui/icons/Brush';

import { TYPE_CANVAS_DOCUMENT } from './model';
import { Canvas } from './Canvas';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/canvas',
  displayName: 'Canvas',

  icon: Icon,
  main: Canvas,
  type: TYPE_CANVAS_DOCUMENT
};
