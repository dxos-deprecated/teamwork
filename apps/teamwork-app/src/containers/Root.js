//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import leveljs from 'level-js';

import { ErrorHandler } from '@dxos/debug';
import { Client } from '@dxos/client';
import {
  SET_LAYOUT,
  AppKitContextProvider,
  CheckForErrors,
  DefaultRouter,
  Registration,
  RequireWallet,
  SystemRoutes,
  Theme
} from '@dxos/react-appkit';
import { ClientProvider } from '@dxos/react-client';
import MessengerPad from '@dxos/messenger-pad';
import EditorPad from '@dxos/editor-pad';
import PlannerPad from '@dxos/planner-pad';
import CanvasApp from '@dxos/canvas-pad';
import TestingPad from '@dxos/testing-pad';
import { createStorage } from '@dxos/random-access-multi-storage';
import { Keyring, KeyStore } from '@dxos/credentials';

import App from './App';
import Home from './Home';

const initialState = {
  [SET_LAYOUT]: {
    showSidebar: false,
    showDebug: false
  }
};

const pads = [
  MessengerPad,
  EditorPad,
  PlannerPad,
  CanvasApp,
  TestingPad
];

const Root = ({ config: { client: { feedStorage, keyStorage, swarm }, ...config } }) => {
  const { app: { publicUrl } } = config;
  const keyring = new Keyring(new KeyStore(leveljs(`${keyStorage.root}/keystore`)));
  
  const client = new Client({
    storage: createStorage(feedStorage.root, feedStorage.type),
    keyring,
    swarm
  });

  const router = { ...DefaultRouter, publicUrl};
  const { routes } = router;

  return (
    <Theme>
      <ClientProvider client={client} config={config}>
        <AppKitContextProvider
          initialState={initialState}
          errorHandler={new ErrorHandler()}
          router={router}
          pads={pads}
        >
          <CheckForErrors>
            <HashRouter>
              <Switch>
                <Route exact path={routes.register} component={Registration} />
                <RequireWallet redirect={routes.register}>
                  <Switch>
                    {SystemRoutes(router)}
                    <Route exact path="/app/:topic?"><Redirect to="/home" /></Route>
                    <Route exact path={routes.app} component={App} />

                    <Route exact path="/home" component={Home} />
                    <Redirect to="/home" />
                  </Switch>
                </RequireWallet>
              </Switch>
            </HashRouter>
          </CheckForErrors>
        </AppKitContextProvider>
      </ClientProvider>
    </Theme>
  );
};

export default Root;
