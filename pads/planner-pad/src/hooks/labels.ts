//
// Copyright 2020 DXOS.org
//

import { createContext, useContext } from 'react';

export const labelsContext = createContext<any>(undefined);

export function useLabels () {
  const context = useContext(labelsContext);
  if (context === undefined) {
    throw new Error('Labels context is used outside of its provider');
  }
  return context;
}
