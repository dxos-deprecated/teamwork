//
// Copyright 2020 DXOS.org
//

import * as Integrations from '@sentry/integrations';
import * as Sentry from '@sentry/react';

import { loadConfig } from './config';

(async () => {
  const cfg = await loadConfig();

  if (cfg.get('sentry.dsn')) {
    const sentryDns = cfg.get('sentry.dsn');
    Sentry.init({
      dsn: sentryDns,
      environment: cfg.get('sentry.environment') || process.env.NODE_ENV,
      integrations: [
        new Integrations.CaptureConsole({
          levels: ['error']
        })
      ]
    });
  }

  // We have this two-stage init process so that sentry can report errors that happen during module imports.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { initApp } = require('./init');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  initApp(cfg);
})();
