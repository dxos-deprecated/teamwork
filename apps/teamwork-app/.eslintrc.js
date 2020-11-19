//
// Copyright 2020 DXOS.org
//

const baseConfig = require('../../.eslintrc.react.js');

module.exports = {
  ...baseConfig,
  env: {
    'jest/globals': true
  }
};
