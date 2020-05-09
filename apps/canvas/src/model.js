//
// Copyright 2020 DxOS.org
//

import assert from 'assert';
import { useState, useEffect } from 'react';

import { useModel, useProfile } from '@dxos/react-client';
import { createId } from '@dxos/crypto';

// TODO(burdon): Factor out to echodb.

// TODO(burdon): Define types.
const TYPE_CANVAS_DOCUMENT = 'testing.canvas.Drawing';
const TYPE_CANVAS_MESSAGE = 'testing.canvas.Message';

/**
 * Provides document list and document creator.
 * @param {string} topic
 * @returns {[Object[], function]}
 */
export const useDocumentList = (topic) => {
  const model = useModel({ options: { type: TYPE_CANVAS_DOCUMENT, topic } });
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

    // Create chanel.
    title => {
      const id = createId();
      model.appendMessage({ __type_url: TYPE_CANVAS_DOCUMENT, id, title });
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
  const model = useModel({ options: { type: TYPE_CANVAS_DOCUMENT, topic, id: documentId } });
  if (!model) {
    return [[]];
  }

  // TODO(burdon): CRDT.
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
 * Provides document messages and appender.
 * @param topic
 * @param documentId
 * @returns {[Object[], function]}
 */
export const useDocumentMessages = (topic, documentId) => {
  assert(topic);
  assert(documentId);

  const { username } = useProfile();

  const model = useModel({ options: { type: TYPE_CANVAS_MESSAGE, topic, documentId } });

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (model) {
      model.on('update', () => {
        setMessages(
          [...model.messages]
            .sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0))
        );
      });
    }
  }, [model]);

  return [
    messages,

    text => {
      const id = createId();
      model.appendMessage({
        __type_url: TYPE_CANVAS_MESSAGE,
        id,
        timestamp: Date.now(),                      // TODO(burdon): Format?
        sender: username,                           // TODO(burdon): Asscoiate with feed (not each message?)
        text,
      });
      return id;
    }
  ];
};
