//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { Chance } from 'chance';

import { useModel } from '@dxos/react-client';
import { ViewModel } from '@dxos/view-model';
import { usePads } from '@dxos/react-appkit';
import { TextModel, TYPE_TEXT_MODEL_UPDATE } from '@dxos/text-model';

export const TYPE_EDITOR_DOCUMENT = 'wrn_dxos_org_teamwork_editor_document';
export const TYPE_EDITOR_UPDATE = TYPE_TEXT_MODEL_UPDATE;

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
    createView: (type) => {
      assert(model);
      assert(type);
      const displayName = `embeded-item-${chance.word()}`;
      const viewId = model.createView(type, displayName);
      return { __type_url: type, viewId, displayName };
    }
  };
};
