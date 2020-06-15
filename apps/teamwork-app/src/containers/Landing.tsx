//
// Copyright 2020 DxOS, Inc.
//

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Fab, Zoom, CircularProgress, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { useClient, useParties } from '@dxos/react-client';
import { AppContainer } from '@dxos/react-appkit';

import { PartyGroup } from '../components/PartyGroup';

const useStyles = makeStyles({
  root: {
    overflowY: 'scroll'
  },
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 60,
    left: 'auto',
    position: 'fixed'
  }
});

export const Landing = () => {
  const client = useClient();
  const parties = useParties();
  const classes = useStyles();
  const [inProgress, setInProgress] = useState(false);

  async function createParty () {
    if (inProgress) return;
    setInProgress(true);
    try {
      await client.partyManager.createParty();
    } catch (e) {
      console.error(e);
      throw new Error('Unable to create a party');
    } finally {
      setInProgress(false);
    }
  }

  return (
    <AppContainer>
      <div className={classes.root}>
        {parties.map((party: any) => (
          <PartyGroup key={party.publicKey.toString()} party={party} />
        ))}
      </div>
      <Zoom in={true} timeout={500} unmountOnExit>
        <Tooltip title="Create party" aria-label="create party" placement="top">
          <Fab color="primary" className={classes.fab} onClick={createParty}>
            {inProgress ? <CircularProgress color="secondary" /> : <Add /> }
          </Fab>
        </Tooltip>
      </Zoom>
    </AppContainer>
  );
};
