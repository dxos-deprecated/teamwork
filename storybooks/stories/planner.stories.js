//
// Copyright 2020 DXOS.org
//

import React from 'react';

import pad from '@dxos/planner-pad';
import StorybookInitializer from './StorybookInitializer';

export default {
  title: 'Planner pad'
};

export const withPlannerPad = () => {
  return (
    <StorybookInitializer
      createItem={pad.create}
      pad={pad.main}
    />
  );
};
