//
// Copyright 2020 DXOS.org
//

import React from 'react';
import assert from 'assert';
import { Chance } from 'chance';

import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useItems } from './model';

const chance = new Chance();

export default function EditorPad ({ topic, viewId }) {
  assert(topic);
  assert(viewId);

  const [pads] = usePads();
  const viewModel = useItems(topic, pads.map((pad) => pad.type));
  function onCreateItem (type) {
    const displayName = `embeded-item-${chance.word()}`;
    const viewId = viewModel.createView(type, displayName);
    return { __type_url: type, viewId, displayName };
  }

  return (
    <Editor
      topic={topic}
      itemId={viewId}
      pads={pads}
      items={viewModel.getAllViews()}
      onCreateItem={onCreateItem}
    />
  );
}
