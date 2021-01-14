//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { ClientInitializer } from '@dxos/react-appkit';
import { config, PadContainer } from '@dxos/react-storybook';

import meta from '../src';

export default {
  title: 'Canvas'
};

// TODO(burdon): Generate data.
export const withPad = () => {
  return (
    <ClientInitializer config={config}>
      <PadContainer meta={meta} />
    </ClientInitializer>
  );
};
