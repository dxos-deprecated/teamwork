//
// Copyright 2020 DxOS.org
//

import assert from 'assert';

import { EchoModel } from '@dxos/echodb';
import { useModel } from '@dxos/react-client';

// TODO(burdon): Slashes not allowed.
// TODO(burdon): Standardize "document" for all apps (or item?)
const TYPE_CANVAS_DOCUMENT = 'wrn_dxos_org_canvas_echo_document';
const TYPE_CANVAS_ECHO_OBJECT = 'wrn_dxos_org_canvas_echo_object';

// TODO(burdon): Replace.
const toSafeId = id => id.replace('/', '__');
const fromSafeId = id => id.replace('__', '/');

/**
 * Document list.
 *
 * @param {string} topic
 * @returns {[Object[], function]}
 */
export const useDocumentList = (topic) => {
  const model = useModel({ model: EchoModel, options: { type: TYPE_CANVAS_DOCUMENT, topic } });
  if (!model) {
    return [[]];
  }

  const documents = model.getObjectsByType(TYPE_CANVAS_DOCUMENT)
    .map(({ id, properties: { title } }) => ({ id: toSafeId(id), title }));

  // TODO(burdon): Convert to object with methods.
  return [
    documents,

    // TODO(burdon): Pass-in properties (not just title).
    title => toSafeId(model.createItem(TYPE_CANVAS_DOCUMENT, { title }))
  ];
};

/**
 * Document metadata.
 *
 * @param {string} topic
 * @param {string} documentId
 * @returns {[{title}, function]}
 */
export const useDocumentMetadata = (topic, documentId) => {
  // TODO(burdon): Should not be called with null.
  // assert(topic);
  // assert(documentId);

  // TODO(burdon): Cannot filter by documentId.
  const model = useModel({ model: EchoModel, options: { type: TYPE_CANVAS_DOCUMENT, topic } });
  if (!model) {
    return [[]];
  }

  const documents = model.getObjectsByType(TYPE_CANVAS_DOCUMENT);
  const document = documents.find(document => document.id === fromSafeId(documentId));

  // TODO(burdon): May not have loaded yet?
  if (!document) {
    return [{}];
  }

  const { properties } = document;

  // TODO(burdon): Convert to object with methods.
  return [
    properties,

    ({ title }) => model.updateItem(document.id, { title })
  ];
};

/**
 * Document state.
 *
 * @param topic
 * @param documentId
 * @returns {{ objects: Object[] }}
 */
export const useDocument = (topic, documentId) => {
  assert(topic);
  assert(documentId);

  // TODO(burdon): Why do we specify type in createItem AND here?
  const model = useModel({
    model: EchoModel,
    options: {
      type: TYPE_CANVAS_ECHO_OBJECT,
      topic,
      documentId: fromSafeId(documentId)
    }
  });

  // TODO(burdon): Don't return null.
  if (!model) {
    return { objects: [] };
  }

  const objects = model.getObjectsByType(TYPE_CANVAS_ECHO_OBJECT);

  return {
    objects,

    createObject: (properties) => {
      return model.createItem(TYPE_CANVAS_ECHO_OBJECT, properties);
    },

    updateObject: (id, properties) => {
      model.updateItem(id, properties);
    },

    deleteObject: (id) => {
      model.deleteItem(id);
    }
  };
};
