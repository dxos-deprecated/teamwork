//
// Copyright 2020 DXOS.org
//

import React from 'react';

import meta from '@dxos/planner-pad';
import { ClientInitializer } from '@dxos/react-appkit';

import { config, PadContainer } from '../utils';

export default {
  title: 'Planner'
};

// TODO(burdon): Generate data.
export const withPad = () => {
  return (
    <ClientInitializer config={config}>
      <PadContainer meta={meta} />
    </ClientInitializer>
  );
};
