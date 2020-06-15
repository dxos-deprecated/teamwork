//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import assert from 'assert';

import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';

export interface EditorPadProps {
  topic: string,
  itemId: string,
  items: any[],
  onCreateItem: (type: string) => void,
}

export default function EditorPad (props: EditorPadProps) {
  const { topic, itemId, items, onCreateItem } = props;
  const [pads] = usePads();
  assert(topic);
  assert(itemId);

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
