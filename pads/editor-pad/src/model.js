//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { keyToBuffer } from '@dxos/crypto';
import { useItems } from '@dxos/react-client';
import { TYPE_TEXT_MODEL_UPDATE } from '@dxos/text-model';

export const TYPE_EDITOR_DOCUMENT = 'wrn_dxos_org_teamwork_editor_document';
export const TYPE_EDITOR_UPDATE = TYPE_TEXT_MODEL_UPDATE;

/**
 * Provides the document content.
 */
export const useDocumentUpdateModel = (topic, documentId) => {
  assert(topic);
  assert(documentId);
  const [editor] = useItems({ partyKey: keyToBuffer(topic), parent: documentId, type: TYPE_EDITOR_UPDATE });
  return editor && editor.model && editor.model.model; // using adapter
};
