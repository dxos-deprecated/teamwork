//
// Copyright 2020 DXOS.org
//

import React from 'react';
import assert from 'assert';
import { Chance } from 'chance';

import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useItemList } from './model';

const chance = new Chance();

export default function EditorPad ({ topic, viewId }) {
  assert(topic);
  assert(viewId);

  const [pads] = usePads();
  const { items, createItem } = useItemList(topic, pads.map((pad) => pad.type));
  function onCreateItem (type) {
    const title = `item-${chance.word()}`;
    const viewId = createItem(type, title);
    return { __type_url: type, viewId, title };
  }

  return (
    <Editor
      topic={topic}
      itemId={viewId}
      pads={pads}
      items={items}
      onCreateItem={onCreateItem}
    />
  );
}
