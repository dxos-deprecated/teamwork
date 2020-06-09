
import React from 'react';

import Editor from './components/Editor';

export default function EditorPad (props) {
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
