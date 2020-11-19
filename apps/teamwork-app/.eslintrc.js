//
// Copyright 2020 DXOS.org
//

const baseConfig = require('../../.eslintrc.react.js');

module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'plugin:jest/recommended'
  ]
};
