//
// Copyright 2020 DXOS.org
//

import React from 'react';

import pad from '@dxos/table-pad';
import StorybookInitializer from './StorybookInitializer';

export default {
  title: 'Table pad'
};

export const withTableTab = () => {
  return (
    <StorybookInitializer
      createItem={pad.create}
      pad={pad.main}
    />
  );
};
