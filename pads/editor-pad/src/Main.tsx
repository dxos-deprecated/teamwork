//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import assert from 'assert';

import { Editor } from './components/Editor';

export interface EditorPadProps {
  topic: string,
  itemId: string,
  pads: any[],
  items: any[],
  onCreateItem: (type: string) => void,
}

export default function EditorPad (props: EditorPadProps) {
  const { topic, itemId, pads, items, onCreateItem } = props;
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
