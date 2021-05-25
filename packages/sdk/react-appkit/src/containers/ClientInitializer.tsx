//
// Copyright 2020 DXOS.org
//

import React, { ReactNode, useEffect, useState } from 'react';

import { Client, ClientConfig } from '@dxos/client';
import { OpenProgress } from '@dxos/echo-db';
import { ClientProvider } from '@dxos/react-client';
import { ErrorBoundary, ErrorView } from '@dxos/react-ux';

import { InitializeLoader } from '../components';

export interface ClientInitializerProps {
  config?: ClientConfig
  loader?: React.ComponentType<{ value: number }>
  children?: ReactNode

  /** @deprecated */
  preInitialize?: (client: Client) => Promise<void> | void
}

/**
 * ClientInitializer - Provides Client initialization abstraction with error handling
 */
// TODO(burdon): Bad abstraction -- hides client construction. Replace with ErrorWrapper.
// TODO(rzadp): removing preInitialize is blocked on:
// ISSUE: https://github.com/dxos/echo/issues/329
export const ClientInitializer = ({ config, loader, children, preInitialize }: ClientInitializerProps) => {
  const [client] = useState(() => new Client(config));
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<undefined | Error | string>(undefined);

  // TODO(burdon): Compute process.
  const [progress, setProgress] = useState<OpenProgress>({ haloOpened: false });
  const [progressValue, setProgressValue] = useState(0);
  useEffect(() => {
    const { partiesOpened = 0, totalParties } = progress;
    const value = totalParties ? (partiesOpened / totalParties) * 100 : 100;
    setProgressValue(value);
  }, [progress]);

  useEffect(() => {
    (async () => {
      await preInitialize?.(client);
      try {
        // TODO(burdon): Options param.
        await client.initialize(setProgress);
        setReady(true);
      } catch (ex) {
        // It's important to print the error to the console here so sentry can report it.
        console.error(ex);
        setError(ex);
      }
    })();
  }, []);

  const handleRestart = () => {
    window.location.reload();
  };

  const handleReset = async () => {
    await client.reset();
    handleRestart();
  };

  if (error) {
    return <ErrorView onRestart={handleRestart} onReset={handleReset} error={error} />;
  }

  const Loader = loader ?? InitializeLoader;

  return (
    <ErrorBoundary
      config={config}
      // It's important to print the error to the console here so sentry can report it.
      onError={console.error}
      onRestart={handleRestart}
      onReset={handleReset}
    >
      <ClientProvider client={client}>
        {ready ? children : (
          Loader && <Loader value={progressValue} />
        )}
      </ClientProvider>
    </ErrorBoundary>
  );
};

export default ClientInitializer;
