//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import assert from 'assert';
import { Chance } from 'chance';

import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useItemList } from './model';

const chance = new Chance();

export interface EditorPadProps {
  topic: string,
  itemId: string,
}

export default function EditorPad ({ topic, itemId }: EditorPadProps) {
  assert(topic);
  assert(itemId);

  const [pads] = usePads();
  const { items, createItem } = useItemList(topic, pads.map((pad: any) => pad.type));
  function onCreateItem(type: string) {
    const title = `item-${chance.word()}`;
    const itemId = createItem({ __type_url: type, title });
    return { __type_url: type, itemId, title };
  }

  return (
    <Editor
      topic={topic}
      itemId={itemId}
      pads={pads}
      items={items}
      onCreateItem={onCreateItem}
    />
  );
}
