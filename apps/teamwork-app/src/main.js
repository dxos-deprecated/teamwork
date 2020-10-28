//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import { loadConfig } from './config';
import Root from './containers/Root';

(async () => {
  const cfg = await loadConfig();

  debug.enable(cfg.get('debug.logging'));

  ReactDOM.render(
    <Root
      clientConfig={cfg.values}
    />,
    document.getElementById(cfg.get('app.rootElement'))
  );
})();
