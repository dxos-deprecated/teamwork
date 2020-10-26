//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { keyToBuffer } from '@dxos/crypto';
import { useItems } from '@dxos/react-client';
import { TYPE_TEXT_MODEL_UPDATE } from '@dxos/text-model'; // TODO(burdon): Standardize exported consts.

export const EDITOR_PAD = 'dxos.org/pad/editor';
export const EDITOR_TYPE_DOCUMENT = 'dxos.org/type/editor/document';
export const EDITOR_TYPE_UPDATE = TYPE_TEXT_MODEL_UPDATE;

/**
 * Provides the document content.
 */
export const useDocumentUpdateModel = (topic, documentId) => {
  assert(topic);
  assert(documentId);
  const [editor] = useItems({ partyKey: keyToBuffer(topic), parent: documentId, type: EDITOR_TYPE_UPDATE });
  return editor && editor.model && editor.model.model; // Using adapter.
};
