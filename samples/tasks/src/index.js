//
// Copyright 2020 DXOS, Inc.
//

import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root';
import { loadConfig } from './config';

(async () => {
  const config = await loadConfig();

  ReactDOM.render(<Root config={config.values} />, document.getElementById(config.get('app.rootElement')));
})();
