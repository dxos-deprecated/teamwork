//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

import Editor from './components/Editor';

export interface EditorPadProps {
  topic: string,
  itemId: string | number,
  pads: any[],
  items: any[],
  onCreateItem: (item: any) => void,
}

export default function EditorPad (props: EditorPadProps) {
  const { topic, itemId, pads, items, onCreateItem } = props;

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
