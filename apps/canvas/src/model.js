//
// Copyright 2020 DxOS.org
//

import assert from 'assert';

import { createId } from '@dxos/crypto';
import { EchoModel } from '@dxos/echodb';
import { useModel } from '@dxos/react-client';

// TODO(burdon): Standardize "document" for all apps (or item?)
// TODO(burdon): Slashes not allowed.
const TYPE_CANVAS_DOCUMENT = 'wrn_dxos_org_canvas_echo_document';
const TYPE_CANVAS_ECHO_OBJECT = 'wrn_dxos_org_canvas_echo_object';

/**
 * Document list.
 *
 * @param {string} topic
 * @returns {[Object[], function]}
 */
export const useDocumentList = (topic) => {
  // TODO(burdon): Covert to use EchoModel.
  // const model = useModel({ model: EchoModel, options: { type: TYPE_CANVAS_DOCUMENT, topic } });
  const model = useModel({ options: { type: TYPE_CANVAS_DOCUMENT, topic } });
  if (!model) {
    return [[]];
  }

  const { messages = [] } = model;
  const documents = Object.values(messages.reduce((map, document) => {
    map[document.id] = document;
    return map;
  }, {}));

  // const objects = model.getObjectsByType(TYPE_CANVAS_DOCUMENT);
  // console.log(objects);
  console.log(documents);

  return [
    documents,

    // TODO(burdon): Fails since id must not have slashes (breaks URL).
    // objects.map(({ id, properties: { title } }) => ({ id, title })),

    // Create chanel.
    title => {
      // return model.createItem(TYPE_CANVAS_DOCUMENT, { title });

      const id = createId();
      model.appendMessage({ __type_url: TYPE_CANVAS_DOCUMENT, id, title });
      return id;
    }
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
  // TODO(burdon): Covert to use EchoModel.
  const model = useModel({ options: { type: TYPE_CANVAS_DOCUMENT, topic, id: documentId } });
  if (!model) {
    return [[]];
  }

  const { messages = [] } = model;
  const { title } = messages.length > 0 ? messages[messages.length - 1] : {};

  return [
    { title },
    ({ title }) => {
      model.appendMessage({ __type_url: TYPE_CANVAS_DOCUMENT, id: documentId, title });
    }
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

  // TODO(burdon): Don't return null.
  // TODO(burdon): Why do we specify type in createItem AND here?
  const model = useModel({ model: EchoModel, options: { type: TYPE_CANVAS_ECHO_OBJECT, topic, documentId } });
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
