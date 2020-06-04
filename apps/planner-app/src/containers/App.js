//
// Copyright 2018 Wireline, Inc.
//

import React, { useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer } from '@dxos/react-appkit';

import Board from './Board';
import Sidebar from './Sidebar';

const useStyles = makeStyles(() => ({
  main: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
}));

const App = () => {
  const classes = useStyles();
  const { topic, item } = useParams();
  const client = useClient();

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic));
    }
  }, [topic]);

  return (
    <AppContainer
      appBarContent={<Fragment />}
      sidebarContent={<Sidebar topic={topic} />}
    >
      <div className={classes.main}>
        {item && <Board />}
      </div>
    </AppContainer>
  );
};

export default App;
