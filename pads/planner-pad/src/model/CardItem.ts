//
// Copyright 2020 DxOS, Inc.
//

import { CardProperties } from './CardProperties';

export interface CardItem {
  id: string,
  deleted: boolean,
  properties: CardProperties
}
