//
// Copyright 2020 DxOS, Inc.
//

import { ComponentType } from 'react';

export interface Pad {
  name: string,
  displayName: string,
  icon: ComponentType
  main: ComponentType<any> // TODO(marik-d): refactor editor pad to not take any props
  type: string,
  description?: string,
}
