//
// Copyright 2020 DxOS, Inc.
//

import { useModel } from '@dxos/react-client';

export const BOARD_TYPE = 'testing.planner.Board';

export interface BoardItem {
  __type_url: string
  viewId: string,
  title: string,
  description: string,
  deleted: boolean,
}

export type EditBoard = (opts: Partial<Omit<BoardItem, '__type_url' | 'viewId'>>) => void

export function useBoard (topic: string, viewId: string): [BoardItem | undefined, EditBoard] {
  const model = useModel({ options: { type: BOARD_TYPE, topic, viewId } });
  if (!model || !viewId) {
    return [undefined, () => {}];
  }

  // TODO(burdon): CRDT.
  if (!model?.messages?.length) {
    return [undefined, () => {}];
  }
  const item: BoardItem = Object.assign({}, ...model?.messages);
  const type = item.__type_url;

  return [
    item,
    opts => {
      model.appendMessage({ __type_url: type, viewId, ...opts });
    }
  ];
}
