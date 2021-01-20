//
// Copyright 2020 DXOS.org
//

module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest/presets/js-with-ts',
  transformIgnorePatterns: [
    'node_modules/(?!(@dxos|lib0|y-protocols))'
  ],
  testTimeout: 20000
};
