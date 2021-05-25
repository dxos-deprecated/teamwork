//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root';

export async function initApp (config, sentry) {
  debug.enable(config.get('debug.logging'));

  ReactDOM.render(
    <Root
      clientConfig={config.values}
      sentry={sentry}
    />,
    document.getElementById(config.get('app.rootElement'))
  );
}
