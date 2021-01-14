//
// Copyright 2021 DXOS.org
//

import faker from 'faker';

// TODO(burdon): Update SDK to not require config.
export const config = {
  swarm: {
    signal: '',
    ice: []
  }
};

// TODO(burdon): Factor out (testing utils).
export const times = ({ min, max }, f) => Promise.all([...new Array(faker.random.number({ min, max })).keys()].map(f));

/**
 * Data generator.
 */
export class Generator {
  constructor (create) {
    this._create = create;
  }

  get username () {
    return 'test-user';
  }

  get title () {
    return faker.lorem.words();
  }

  async generate (party, item) {
    this._create && await this._create(party, item);
  }
}
