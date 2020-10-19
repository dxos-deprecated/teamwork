//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import leveljs from 'level-js';
import React from 'react';
import ReactDOM from 'react-dom';

import { Client } from '@dxos/client';
import { Keyring, KeyStore } from '@dxos/credentials';
import { createStorage } from '@dxos/random-access-multi-storage';
import { Registry } from '@wirelineio/registry-client';

import { ErrorView } from './components/ErrorView';
import { loadConfig } from './config';
import Root from './containers/Root';

(async () => {
  const cfg = await loadConfig();

  // TODO(burdon): Why isn't config passed to the app? Make canonical.
  const {
    client: { feedStorage, keyStorage, swarm },
    services: { wns: { server, chainId }, ipfs },
    ...config
  } = cfg.values;

  debug.enable(cfg.get('debug.logging', 'dxos:*')); // TODO(burdon): Use .? syntax.

  // TODO(burdon): Change API to return class (not function with expando properties).
  const storage = createStorage(feedStorage.root, feedStorage.type);
  const keyring = new Keyring(new KeyStore(leveljs(`${keyStorage.root}/keystore`)));
  const registry = new Registry(server, chainId);

  const client = new Client({
    storage,
    keyring,
    registry,
    swarm
  });

  try {
    ReactDOM.render(
      <Root
        config={{ ipfs, ...config }}
        client={client}
      />,
      document.getElementById(cfg.get('app.rootElement'))
    );
  } catch (ex) {
    ReactDOM.render(<ErrorView config={cfg} error={ex} storage={storage} />, document.body);
  }
})();
