//
// Copyright 2020 DxOS, Inc.
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
import { Pad } from '../common';

const initialState = {
  [SET_LAYOUT]: {
    showSidebar: true,
    showDebug: false
  }
};

const pads: Pad[] = [
  MessengerPad,
  EditorPad,
  PlannerPad,
  CanvasApp
];

export interface RootProps {
  config: any
}

export const Root = ({ config }: RootProps) => {
  const router = { ...DefaultRouter, publicUrl: config.app.publicUrl };
  const { paths, routes } = router;

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
                    <Redirect to={paths.home} />
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
