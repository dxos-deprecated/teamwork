//
// Copyright 2020 DXOS.org
//

import React from 'react';

import pad from '@dxos/tasks-pad';

import StorybookInitializer from './StorybookInitializer';

export default {
  title: 'Tasks pad'
};

export const withTasksPad = () => {
  return (
    <StorybookInitializer
      createItem={pad.create}
      pad={pad.main}
    />
  );
};
