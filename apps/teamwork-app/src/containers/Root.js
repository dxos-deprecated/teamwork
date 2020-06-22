//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ErrorHandler } from '@dxos/debug';
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
import { ClientContextProvider } from '@dxos/react-client';
import MessengerPad from '@dxos/messenger-pad';
import EditorPad from '@dxos/editor-pad';
import PlannerPad from '@dxos/planner-pad';
import CanvasApp from '@dxos/canvas-pad';

import App from './App';
import { Landing } from './Landing';

const initialState = {
  [SET_LAYOUT]: {
    showSidebar: true,
    showDebug: false
  }
};

const pads = [
  MessengerPad,
  EditorPad,
  PlannerPad,
  CanvasApp
];

export const Root = ({ config }) => {
  const router = { ...DefaultRouter, publicUrl: config.app.publicUrl };
  const { routes } = router;

  return (
    <Theme>
      <ClientContextProvider config={config}>
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
                    <Route exact path={routes.app} component={App} />
                    <Route exact path="/landing" component={Landing} />
                    <Redirect to="/landing" />
                  </Switch>
                </RequireWallet>
              </Switch>
            </HashRouter>
          </CheckForErrors>
        </AppKitContextProvider>
      </ClientContextProvider>
    </Theme>
  );
};
