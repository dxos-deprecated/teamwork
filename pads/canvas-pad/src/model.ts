//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { PublicKey } from '@dxos/crypto';
import { useItems } from '@dxos/react-client';

export const CANVAS_PAD = 'dxos.org/pad/canvas';
export const CANVAS_TYPE_DIAGRAM = 'dxos.org/type/canvas/diagram';
export const CANVAS_TYPE_OBJECT = 'dxos.org/type/canvas/object';

export const useCanvasModel = (topic: string, itemId: string) => {
  assert(topic);
  assert(itemId);

  const canvasObjects = useItems({ partyKey: PublicKey.from(topic), parent: itemId, type: CANVAS_TYPE_OBJECT } as any);

  return canvasObjects;
};
