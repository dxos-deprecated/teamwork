//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Description';

import { ObjectModel } from '@dxos/object-model';
import { TextModel, TYPE_TEXT_MODEL_UPDATE } from '@dxos/text-model';

import Main from './Main';
import { TYPE_EDITOR_DOCUMENT, TYPE_EDITOR_UPDATE } from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/editor',
  displayName: 'Text Editor',

  icon: Icon,
  main: Main,
  type: TYPE_EDITOR_DOCUMENT,
  contentType: TYPE_EDITOR_UPDATE,
  description: 'Write collaboratively',
  create: async ({ client, party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: TYPE_EDITOR_DOCUMENT,
      props: { title: name || 'random-name' }
    });
    await party.database.createItem({
      model: TextModel,
      parent: item.id
    });
    return item.id;
  }
};
