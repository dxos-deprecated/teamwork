//
// Copyright 2020 DXOS.org
//

import React from 'react';

import pad from '@dxos/messenger-pad';

import StorybookInitializer from './StorybookInitializer';

export default {
  title: 'Messenger pad'
};

export const withMessengerPad = () => {
  return (
    <StorybookInitializer
      createItem={pad.create}
      pad={pad.main}
      registerModel={pad.register}
    />
  );
};
