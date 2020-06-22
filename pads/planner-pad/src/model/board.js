//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';

export const BOARD_TYPE = 'testing.planner.Board';

export function useBoard (topic, viewId) {
  const model = useModel({ options: { type: BOARD_TYPE, topic, viewId } });
  if (!model || !viewId) {
    return [undefined, () => {}];
  }

  // TODO(burdon): CRDT.
  if (!model?.messages?.length) {
    return [undefined, () => {}];
  }
  const item = Object.assign({}, ...model?.messages);
  const type = item.__type_url;

  return [
    item,
    opts => {
      model.appendMessage({ __type_url: type, viewId, ...opts });
    }
  ];
}
