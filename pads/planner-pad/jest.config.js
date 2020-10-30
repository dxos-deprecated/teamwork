//
// Copyright 2020 DXOS.org
//

module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@dxos)/)'
  ]
};
