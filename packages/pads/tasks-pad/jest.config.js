//
// Copyright 2020 DXOS.org
//

module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest/presets/js-with-ts',
  // transformIgnorePatterns: [
  //   'node_modules/(?!(@dxos)/)'
  // ],
  testTimeout: 20000,

  // https://stackoverflow.com/a/60905543
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }

};
