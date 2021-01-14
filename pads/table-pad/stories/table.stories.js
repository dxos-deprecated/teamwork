//
// Copyright 2020 DXOS.org
//

import faker from 'faker';
import React from 'react';

import { ClientInitializer } from '@dxos/react-appkit';
import { times, config, PadContainer, Generator } from '@dxos/react-storybook';

import meta, { createRecord } from '../src';

export default {
  title: 'Table'
};

export const withPad = () => {
  const generator = new Generator(async (party, item) => {
    // Columns.
    // TODO(burdon): NOTE: API will change since columns should be properties of entity item.
    const columns = await times({ min: 2, max: 5 }, async (i) => {
      const name = faker.lorem.word();
      const type = faker.random.boolean() ? 'text' : 'checkbox';
      // TODO(burdon): Rename properties (name, type).
      await item.model.setProperty(`field.${i}.headerName`, name);
      await item.model.setProperty(`field.${i}.columnType`, type);
      return { name, type };
    });

    // Records
    await times({ min: 3, max: 10 }, async () => {
      const data = columns.reduce((data, { name, type }) => {
        const i = columns.findIndex(c => c.name === name);
        return {
          ...data,
          [i]: type === 'text' ? faker.lorem.word() : faker.random.boolean()
        };
      }, {});

      await createRecord({ party, itemId: item.id }, data);
    });
  });

  return (
    <ClientInitializer config={config}>
      <PadContainer meta={meta} generator={generator} />
    </ClientInitializer>
  );
};
