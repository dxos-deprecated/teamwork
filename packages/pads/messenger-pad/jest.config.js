//
// Copyright 2020 DXOS.org
//

module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest/presets/js-with-ts',
  transformIgnorePatterns: [
    'node_modules/(?!(lib0|y-protocols))'
  ],
  testTimeout: 20000,
  moduleNameMapper: {
    '.+\\.(png|jpg)$': '<rootDir>/image.mock.js'
  },

  // https://stackoverflow.com/a/60905543
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
