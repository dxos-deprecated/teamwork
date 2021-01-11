//
// Copyright 2020 DXOS.org
//

import React from 'react';

import pad from '@dxos/editor-pad';
import StorybookInitializer from './StorybookInitializer';

export default {
  title: 'Editor pad'
};

export const withEditorPad = () => {
  return (
    <StorybookInitializer
      createItem={pad.create}
      pad={pad.main}
      registerModel={pad.register}
    />
  );
};
