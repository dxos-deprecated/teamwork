//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';

import { useModel } from '@dxos/react-client';

// TODO(burdon): Define types.
export const TYPE_EDITOR_DOCUMENT = 'testing.document.Document';
export const TYPE_EDITOR_UPDATE = 'testing.document.Update';

/**
 * Provides the document content.
 */
export const useDocumentUpdateModel = (topic: string, documentId: string): any => {
  assert(topic);
  assert(documentId);

  const model = useModel({
    options: { type: TYPE_EDITOR_UPDATE, topic, documentId, disableUpdateHandler: true }
  });

  return model;
};
