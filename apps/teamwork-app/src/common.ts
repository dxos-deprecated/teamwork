//
// Copyright 2020 DxOS, Inc.
//

import { ComponentType } from 'react';

import MessengerPad from '@dxos/messenger-pad';
import EditorPad from '@dxos/editor-pad';
import PlannerPad from '@dxos/planner-pad';
import CanvasApp from '@dxos/canvas-pad';

export interface Pad {
  name: string,
  displayName: string,
  icon: ComponentType
  main: ComponentType<any> // TODO(marik-d): refactor editor pad to not take any props
  type: string
}

export const supportedPads: Pad[] = [
  MessengerPad,
  EditorPad,
  PlannerPad,
  CanvasApp
];
