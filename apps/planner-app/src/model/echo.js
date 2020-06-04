//
// Copyright 2019 Wireline, Inc.
//

import { MutationUtil } from '@dxos/echodb';
import { Model } from '@dxos/data-client';

import { ObjectModel } from './object';

export class EchoModel extends Model {

  constructor(type) {
    super();
    this.type = type;
    this._model = new ObjectModel();

    // We can overwrite this in the test suite.
    this._idProvider = () => ObjectModel.createId(this.type);
  }

  getObjects() {
    return this._model.getObjects(this.type).map(EchoModel.unwrap);
  }

  createItem(properties) {
    const id = this._idProvider(this.type);

    const mutations = ObjectModel.fromObject({ id, properties });
    mutations.forEach(mutation => {
      this.appendMessage({
        __type_url: this.type,
        ...mutation
      });
    });

    return id;
  }

  updateItem(id, properties) {
    const mutations = ObjectModel.fromObject({ id, properties });

    mutations.forEach(mutation => {
      this.appendMessage({
        __type_url: this.type,
        ...mutation
      });
    });
  }

  deleteItem(id) {
    const mutation = MutationUtil.createMessage(id, undefined, {
      deleted: true
    });

    this.appendMessage({
      __type_url: this.type,
      ...mutation
    });
  }

  onUpdate(messages) {
    this._model.applyMutations(messages);
  }

  static wrap({ id, ...properties }) {
    return { id, properties };
  }

  static unwrap({ id, properties }) {
    return { id, ...properties };
  }

}
