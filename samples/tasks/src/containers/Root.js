//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ErrorHandler } from '@dxos/debug';
import { ClientContextProvider } from '@dxos/react-client';
import {
  DefaultRouter,
  Registration,
  RequireWallet,
  AppKitContextProvider
} from '@dxos/react-appkit';

import Home from './Home';
import List from './List';

const Root = ({ config }) => {
  const router = { ...DefaultRouter, publicUrl: config.app.publicUrl };
  const { routes } = router;

  return (
    <ClientContextProvider config={config}>
      <AppKitContextProvider
        initialState={{}}
        errorHandler={new ErrorHandler()}
        router={router}
        pads={[]}
      >
        <HashRouter>
          <Switch>
            <Route exact path={routes.register} component={Registration} />
            <RequireWallet redirect={routes.register}>
              <Route exact path="/" component={Home} />
              <Route exact path="/:topic" component={List} />
              <Redirect to="/" />
            </RequireWallet>
          </Switch>
        </HashRouter>
      </AppKitContextProvider>
    </ClientContextProvider>
  );
};

export default Root;
