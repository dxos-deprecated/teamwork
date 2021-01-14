//
// Copyright 2020 DXOS.org
//

import React from 'react';

import pad from '@dxos/editor-pad';
import { ClientInitializer } from '@dxos/react-appkit';

import { config, usePadTest } from '../utils';

export default {
  title: 'Editor pad'
};

const EditorPad = () => {
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

export const withMessengerPad = () => {
  return (
    <ClientInitializer config={config}>
      <EditorPad />
    </ClientInitializer>
  );
};
