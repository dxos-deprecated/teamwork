//
// Copyright 2020 DXOS.org
//

import faker from 'faker';
import React from 'react';

import { ClientInitializer } from '@dxos/react-appkit';
import meta, { createColumn, createRecord } from '@dxos/table-pad';

import { config, PadContainer, Generator } from '../utils';

export default {
  title: 'Table'
};

// TODO(burdon): Factor out (testing utils).
const times = ({ min, max }, f) => Promise.all([...new Array(faker.random.number({ min, max })).keys()].map(f));

export const withTablePad = () => {
  const generator = new Generator(async (party, item) => {
    // Columns.
    // TODO(burdon): NOTE: API will change since columns should be properties of entity item.
    const columns = await times({ min: 1, max: 3 }, async (i) => {
      const name = faker.lorem.word();
      const type = faker.random.boolean() ? 'text' : 'checkbox';
      // TODO(burdon): Rename properties (name, type).
      await item.model.setProperty(`field.${i}.headerName`, name);
      await item.model.setProperty(`field.${i}.columnType`, type);
      return { name, type };
    });

    console.log(columns);

    await times({ min: 3, max: 5 }, async () => {
      const data = columns.reduce((data, { name, type }) => ({
        ...data,
        [name]: type === 'text' ? faker.lorem.word() : faker.random.boolean()
      }), {});

      console.log(data);
      await createRecord({ party, itemId: item.id }, data);
    });

    /*
    for await (const i of new Array(faker.random.number({ min: 3, max: 5 }))) {
      const row = exampleRows[i];
      // Change header to id in order to properly save the column value.
      // e.g. { id: 1, lastName: 'Snow' } => { id: 1, xdgawe123f: 'Snow' }
      const transformedRow = Object.keys(row).reduce((acc, curr) => ({ ...acc, [newColumnIds[curr]]: row[curr] }), {});
      await createRecord({ party, itemId }, transformedRow);
    }
    */
  });

  return (
    <ClientInitializer config={config}>
      <PadContainer meta={meta} generator={generator} />
    </ClientInitializer>
  );
};
