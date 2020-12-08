//
// Copyright 2020 DXOS.org
//

import { render, screen } from '@testing-library/react';
import React from 'react';

import Tasks from '../src/Tasks';
import tasksPad, { createTask } from '../src/index';
import { setupClient, createItem } from './util';

describe('Test Tasks', () => {
  let party, padId, client;

  beforeAll(async () => {
    const setup = await setupClient();
    party = setup.party;
    client = setup.client;
    padId = (await createItem(party, tasksPad, 'testing-tasks')).id;
  });

  afterAll(async () => {
    await client.destroy();
  });

  it('Render Tasks', async () => {
    const task1 = await createTask({ party, padId }, { text: 'Task1' });
    const task2 = await createTask({ party, padId }, { text: 'Task2' });
    const task3 = await createTask({ party, padId }, { text: 'Task3' });
    const title = 'Testing list';

    expect(() => render(<Tasks title={title} items={[task1, task2, task3]}></Tasks>)).not.toThrow();
    expect(() => screen.getByText(task1.model.getProperty('text'))).not.toThrow();
    expect(() => screen.getByText(task2.model.getProperty('text'))).not.toThrow();
    expect(() => screen.getByText(task3.model.getProperty('text'))).not.toThrow();
    expect(() => screen.getByText(title)).not.toThrow();
  });
});
