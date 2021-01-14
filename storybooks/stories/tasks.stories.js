//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { ClientInitializer } from '@dxos/react-appkit';
import pad from '@dxos/tasks-pad';

import { usePadTest } from '../utils';
import config from '../utils/config';

export default {
  title: 'Tasks pad'
};

const TasksPad = () => {
  const { topic, itemId, error } = usePadTest({
    createItem: pad.create,
    registerModel: pad.register
  });
  if (error) {
    throw error;
  }
  if (!topic || !itemId) {
    return null;
  }

  return (
    <pad.main topic={topic} itemId={itemId} />
  );
};

export const withTasksPad = () => {
  return (
    <ClientInitializer config={config}>
      <TasksPad />
    </ClientInitializer>
  );
};
