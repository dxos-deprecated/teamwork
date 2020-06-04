//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';

import { useModel } from '@dxos/react-client';
import { createId } from '@dxos/crypto';
import { DocumentModel } from '@wirelineio/document-model';

// TODO(burdon): Define types.
export const TYPE_EDITOR_DOCUMENT = 'testing.document.Document';
export const TYPE_EDITOR_UPDATE = 'testing.document.Update';

/**
 * Provides document list and document creator.
 * @param {string} topic
 * @returns {[Object[], function]}
 */
export const useDocumentList = (topic) => {
  const model = useModel({ options: { type: TYPE_EDITOR_DOCUMENT, topic } });
  if (!model) {
    return [[]];
  }

  // TODO(burdon): CRDT.
  const { messages = [] } = model;
  const documents = Object.values(messages.reduce((map, document) => {
    map[document.id] = document;
    return map;
  }, {}));

  return [
    documents,

    title => {
      const id = createId();
      model.appendMessage({ __type_url: TYPE_EDITOR_DOCUMENT, id, title });
      return id;
    }
  ];
};

/**
 * Provides document metadata and updater.
 * @param {string} topic
 * @param {string} documentId
 * @returns {[{title}, function]}
 */
export const useDocument = (topic, documentId) => {
  const model = useModel({ options: { type: TYPE_EDITOR_DOCUMENT, topic, id: documentId } });
  if (!model) {
    return [[]];
  }

  // TODO(burdon): CRDT.
  const { messages = [] } = model;
  const { title } = messages.length > 0 ? messages[messages.length - 1] : {};

  return [
    { title },
    ({ title }) => {
      model.appendMessage({ __type_url: TYPE_EDITOR_DOCUMENT, id: documentId, title });
    }
  ];
};

/**
 * Provides the document content.
 * @param topic
 * @param documentId
 * @returns {[Object[], function]}
 */
export const useDocumentUpdateModel = (topic, documentId) => {
  assert(topic);
  assert(documentId);

  const model = useModel({
    model: DocumentModel,
    options: { type: TYPE_EDITOR_UPDATE, topic, documentId, disableUpdateHandler: true }
  });

  return model;
};
