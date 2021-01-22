//
// Copyright 2020 DXOS.org
//

import { useEffect, useState } from 'react';

import { Database } from '@dxos/echo-db';

export type SelectionFilter = Parameters<Database['select']>

// TODO(rzadp): Initially copied from ECHO-DEMO. Need to extract somewhere - echo or appkit
export function useSelection (
  database: Database,
  selectionFilter: SelectionFilter
) {
  const [selection, setSelection] = useState(() => database.select(...selectionFilter));

  useEffect(() => {
    setSelection(database.select(...selectionFilter));
  }, [database, selectionFilter]);

  useEffect(() => {
    return selection.update.on(() => {
      const newSelection = database.select(...selectionFilter);
      setSelection(newSelection);
    });
  }, [selection]);

  return selection.items;
}
