//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ErrorHandler } from '@dxos/debug';
// import CanvasApp from '@dxos/canvas-pad';
// import EditorPad from '@dxos/editor-pad';
import MessengerPad from '@dxos/messenger-pad';
import PlannerPad from '@dxos/planner-pad';
// import TestingPad from '@dxos/testing-pad';
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
import TodoPad from '@dxos/todo-pad';

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
  // EditorPad,
  PlannerPad,
  // CanvasApp,
  // TestingPad,
  TodoPad
];

const Root = ({ config, client }) => {
  const publicUrl = window.location.pathname;
  const [registered, setRegistered] = useState(false);

  const router = { ...DefaultRouter, publicUrl };
  const { routes } = router;

  const themeBase = {
    // https://material-ui.com/customization/breakpoints/
    breakpoints: {
      values: {
        subMbp: 1600,
        // defaults:
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920
      }
    }
  };

  useEffect(() => {
    const registerPadModels = async () => {
      for (let i = 0; i < pads.length; i++) {
        if (pads[i].register) {
          await pads[i].register(client);
        }
      }
      setRegistered(true);
    };
    registerPadModels();
  }, []);

  if (!registered) return null;

  return (
    <Theme base={themeBase}>
      <ClientProvider client={client} config={config}>
        <AppKitContextProvider
          initialState={initialState}
          errorHandler={new ErrorHandler()}
          router={router}
          pads={pads}
          issuesLink='https://github.com/dxos/teamwork/issues/new'
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
