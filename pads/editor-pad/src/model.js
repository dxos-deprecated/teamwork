//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { keyToBuffer } from '@dxos/crypto';
import { useItems } from '@dxos/react-client';

export const EDITOR_PAD = 'dxos.org/pad/editor';
export const EDITOR_TYPE_DOCUMENT = 'dxos.org/type/editor/document@v2';
export const EDITOR_TYPE_CONTENT = 'dxos.org/type/editor/document/content';

/**
 * Provides the document content.
 */
export const useDocumentUpdateModel = (topic, documentId) => {
  assert(topic);
  assert(documentId);
  const [editor] = useItems({ partyKey: keyToBuffer(topic), parent: documentId, type: EDITOR_TYPE_CONTENT });

  if (editor && editor.parent.id !== documentId) {
    // Correct editor model not loaded yet
    return null;
  }
  return editor && editor.model; // Using adapter.
};
