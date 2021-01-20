//
// Copyright 2020 DXOS.org
//

import faker from 'faker';
import React from 'react';

import { ClientInitializer } from '@dxos/react-appkit';
import { config, times, Generator, PadContainer } from '@dxos/react-storybook';

import meta, { createTask } from '../src';

export default {
  title: 'Tasks'
};

export const withPad = () => {
  const generator = new Generator(async (party, item) => {
    await times({ min: 1, max: 10 }, () => createTask({ party, itemId: item.id }, {
      text: faker.lorem.sentence(),
      completed: faker.random.boolean()
    }));
  });

  return (
    <ClientInitializer config={config}>
      <PadContainer meta={meta} generator={generator} />
    </ClientInitializer>
  );
};
