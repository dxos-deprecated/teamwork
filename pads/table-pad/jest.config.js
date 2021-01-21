//
// Copyright 2020 DXOS.org
//

module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest/presets/js-with-ts',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}'
  ],
  // transformIgnorePatterns: [
  //   'node_modules/(?!(@dxos)/)'
  // ],

  // https://stackoverflow.com/a/60905543
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
