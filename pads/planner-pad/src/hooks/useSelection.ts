//
// Copyright 2020 DXOS.org
//

import { useEffect, useState } from 'react';

import { Selection } from '@dxos/echo-db';

// TODO(rzadp): Copied from ECHO-DEMO. Need to extract somewhere - echo or appkit
export function useSelection<T> (
  selection: Selection<any>,
  selector: (selection: Selection<any>) => T,
  deps: readonly any[] = []
): T {
  const [data, setData] = useState(() => selector(selection));

  // Subscribe to mutation events from source.
  useEffect(() => {
    return selection.update.on(() => {
      setData(selector(selection));
    });
  }, [selection]);

  // Update data when deps change.
  useEffect(() => {
    setData(selector(selection));
  }, deps);

  return data;
}
