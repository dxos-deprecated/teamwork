//
// Copyright 2020 DXOS.org
//

import React from 'react';

import tablePad from '../src';
import { IdentityAndPartyInitializer } from './IdentityAndPartyInitializer';

export default {
  title: 'Table'
};

export const withTable = () => {
  return (
    <IdentityAndPartyInitializer
      createItem={tablePad.create}
      pad={tablePad.main}
    />
  );
};
