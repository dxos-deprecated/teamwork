//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { Chance } from 'chance';

import { keyToBuffer } from '@dxos/crypto';
import { useModel, useItems } from '@dxos/react-client';
import { TextModel, TYPE_TEXT_MODEL_UPDATE } from '@dxos/text-model';

export const TYPE_EDITOR_DOCUMENT = 'wrn_dxos_org_teamwork_editor_document';
export const TYPE_EDITOR_UPDATE = TYPE_TEXT_MODEL_UPDATE;

/**
 * Provides the document content.
 */
export const useDocumentUpdateModel = (topic, documentId) => {
  assert(topic);
  assert(documentId);
  const [editor] = useItems({ partyKey: keyToBuffer(topic), parent: documentId });
  return editor;
};
