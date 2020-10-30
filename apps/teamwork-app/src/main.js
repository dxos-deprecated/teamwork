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

  if (cfg.get('sentry.dsn')) {
    const Sentry = require('@sentry/react');
    const sentryDns = cfg.get('sentry.dsn');
    Sentry.init({ dsn: sentryDns, environment: cfg.get('sentry.environment') || process.env.NODE_ENV });
  }

  debug.enable(cfg.get('debug.logging'));

  ReactDOM.render(
    <Root
      clientConfig={cfg.values}
    />,
    document.getElementById(cfg.get('app.rootElement'))
  );
})();
