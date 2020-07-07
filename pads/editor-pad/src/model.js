//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { Chance } from 'chance';

import { useModel } from '@dxos/react-client';
import { ViewModel } from '@dxos/view-model';
import { usePads } from '@dxos/react-appkit';
import { TextModel } from '@dxos/text-model';

export const TYPE_EDITOR_DOCUMENT = 'dxos.teamwork.editor.document';
export const TYPE_EDITOR_UPDATE = 'testing.document.Update'; // TODO(rzadp) import TYPE_TEXT_MODEL_UPDATE from text-model after https://github.com/dxos/echo/pull/53 gets merged

const chance = new Chance();

/**
 * Provides the document content.
 */
export const useDocumentUpdateModel = (topic, documentId) => {
  assert(topic);
  assert(documentId);

  const model = useModel({
    model: TextModel,
    options: { type: TYPE_EDITOR_UPDATE, topic, documentId }
  });

  return model;
};

/**
 * Provides view list and view creator.
 * @returns {ViewModel}
 */
export const useViews = (topic) => {
  const [pads] = usePads();
  const model = useModel({ model: ViewModel, options: { type: pads.map(pad => pad.type), topic } });

  return {
    views: model?.getAllViews() ?? [],
    createView: () => {
      assert(model);
      const displayName = `embeded-item-${chance.word()}`;
      const viewId = model.createView(TYPE_EDITOR_DOCUMENT, displayName);
      return { __type_url: TYPE_EDITOR_DOCUMENT, viewId, displayName };
    }
  };
};
