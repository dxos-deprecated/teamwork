//
// Copyright 2020 DxOS, Inc.
//

import { ComponentType } from 'react';

export interface PadComponentProps {
  topic: string
  viewId: string
}

export interface Pad {
  name: string,
  displayName: string,
  icon: ComponentType
  main: ComponentType<PadComponentProps>
  type: string,
  description?: string,
}
