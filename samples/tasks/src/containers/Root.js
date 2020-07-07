//
// Copyright 2020 DXOS, Inc.
//

import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { ErrorHandler } from '@dxos/debug';
import { ClientContextProvider } from '@dxos/react-client';
import {
  DefaultRouter,
  Registration,
  RequireWallet,
  AppKitContextProvider
} from '@dxos/react-appkit';

import Home from './Home';
import Tasks from './Tasks';

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
              <Route path="/:topic" component={Tasks} />
            </RequireWallet>
          </Switch>
        </HashRouter>
      </AppKitContextProvider>
    </ClientContextProvider>
  );
};

export default Root;
