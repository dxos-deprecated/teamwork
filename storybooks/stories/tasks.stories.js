//
// Copyright 2020 DXOS.org
//

import faker from 'faker';
import times from 'lodash/times';
import React from 'react';

import { ClientInitializer } from '@dxos/react-appkit';
import meta, { createTask } from '@dxos/tasks-pad';

import { config, Generator, PadContainer } from '../utils';

export default {
  title: 'Tasks'
};

export const withPad = () => {
  const generator = new Generator((party, item) => {
    times(faker.random.number({ min: 1, max: 10 }), () => {
      createTask({ party, itemId: item.id }, {
        text: faker.lorem.sentence(),
        completed: faker.random.boolean()
      });
    });
  });

  return (
    <ClientInitializer config={config}>
      <PadContainer meta={meta} generator={generator} />
    </ClientInitializer>
  );
};
