//
// Copyright 2020 DXOS.org
//

import React from 'react';

import pad from '@dxos/graph-pad';
import { ClientInitializer } from '@dxos/react-appkit';

import { usePadTest } from '../utils';
import config from '../utils/config';

export default {
  title: 'Graph pad'
};

const GraphPad = () => {
  const { topic, itemId, error } = usePadTest({ createItem: pad.create });
  if (error) {
    throw error;
  }
  if (!topic || !itemId) {
    return null;
  }

  return (
    <pad.main topic={topic} itemId={itemId} />
  );
};

export const withGraphPad = () => {
  return (
    <ClientInitializer config={config}>
      <GraphPad />
    </ClientInitializer>
  );
};
