//
// Copyright 2020 DXOS.org
//

module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(@dxos|lib0|y-protocols))'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  }
};
