//
// Copyright 2020 DXOS.org
//

import React from 'react';

import meta from '@dxos/editor-pad';
import { ClientInitializer } from '@dxos/react-appkit';

import { config, PadContainer } from '../utils';

export default {
  title: 'Editor'
};

// TODO(burdon): Generate data.
export const withPad = () => {
  return (
    <ClientInitializer config={config}>
      <PadContainer meta={meta} />
    </ClientInitializer>
  );
};
