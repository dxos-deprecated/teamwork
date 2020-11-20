//
// Copyright 2020 DXOS.org
//

export const waitUntil = async (predicate) => {
  const waitForTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));
  while (!predicate()) {
    await waitForTimeout(10);
  }
};
