//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import CanvasApp from '@dxos/canvas-pad';
import { ErrorHandler } from '@dxos/debug';
import EditorPad from '@dxos/editor-pad';
import MessengerPad from '@dxos/messenger-pad';
import PlannerPad from '@dxos/planner-pad';
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
import TestingPad from '@dxos/testing-pad';

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

const Root = ({ config, client }) => {
  const { app: { publicUrl } } = config;

  const router = { ...DefaultRouter, publicUrl };
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
                <RequireWallet
                  redirect={routes.register}
                  // Allow access to the AUTH route if it is for joining an Identity, otherwise require a Wallet.
                  isRequired={(path = '', query = {}) => !path.startsWith(routes.auth) || !query.identityKey}
                >
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
