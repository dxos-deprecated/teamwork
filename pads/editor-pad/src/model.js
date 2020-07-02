//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { useModel } from '@dxos/react-client';
import { ViewModel } from '@dxos/view-model';
import { usePads } from '@dxos/react-appkit';

// TODO(burdon): Define types.
export const TYPE_EDITOR_DOCUMENT = 'testing.document.Document';
export const TYPE_EDITOR_UPDATE = 'testing.document.Update';

/**
 * Provides the document content.
 */
export const useDocumentUpdateModel = (topic, documentId) => {
  assert(topic);
  assert(documentId);

  const model = useModel({
    options: { type: TYPE_EDITOR_UPDATE, topic, documentId, disableUpdateHandler: true }
  });

  return model;
};

/**
 * Provides item list and item creator.
 * @returns {ViewModel}
 */
export const useItems = (topic) => {
  const [pads] = usePads();
  const model = useModel({ model: ViewModel, options: { type: pads.map(pad => pad.type), topic } });
  return model ?? new ViewModel(); // hack to ensure we dont have any crashes while model is loading
};
