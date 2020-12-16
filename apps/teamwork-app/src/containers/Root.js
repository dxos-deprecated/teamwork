//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ErrorHandler } from '@dxos/debug';
// import CanvasApp from '@dxos/canvas-pad';
import EditorPad from '@dxos/editor-pad';
import MessengerPad from '@dxos/messenger-pad';
import PlannerPad from '@dxos/planner-pad';
import {
  SET_LAYOUT,
  AppKitProvider,
  DefaultRouter,
  Registration,
  RequireWallet,
  SystemRoutes,
  Theme,
  ClientInitializer
} from '@dxos/react-appkit';
// import TablePad from '@dxos/table-pad';
import TasksPad from '@dxos/tasks-pad';
// import TestingPad from '@dxos/testing-pad';

import App from './App';
import Home from './Home';

const initialState = {
  [SET_LAYOUT]: {
    showSidebar: false,
    showDebug: false
  }
};

const pads = [
  // CanvasApp,
  EditorPad,
  MessengerPad,
  PlannerPad,
  TasksPad
  // TablePad
  // TestingPad,
];

const Root = ({ clientConfig, sentry }) => {
  const publicUrl = window.location.pathname;

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

  const preInit = (client) => {
    pads.forEach(pad => pad.register?.(client));
  };

  if (sentry) {
    sentry.captureMessage('Application loaded.');
  }

  return (
    <Theme base={themeBase}>
      <ClientInitializer config={clientConfig} preInitialize={preInit}>
        <AppKitProvider
          initialState={initialState}
          errorHandler={new ErrorHandler()}
          router={router}
          pads={pads}
          issuesLink='https://github.com/dxos/teamwork/issues/new'
          keywords={['teamwork']}
          sentry={sentry}
        >
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
        </AppKitProvider>
      </ClientInitializer>
    </Theme>
  );
};

export default Root;
