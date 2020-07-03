//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { Fab, Zoom, CircularProgress, Tooltip, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { useClient, useParties } from '@dxos/react-client';
import { AppContainer } from '@dxos/react-appkit';

import { PartyCard } from '../components/PartyCard';

const useStyles = makeStyles(theme => ({
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 60,
    left: 'auto',
    position: 'fixed'
  },
  createPartyText: {
    paddingLeft: 20,        // TODO(burdon): Use theme.spacing
    paddingTop: 20,
    color: 'gray'
  },
  createPartyLink: {
    cursor: 'pointer',
    color: theme.palette.primary.light
  },
  grid: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    overflowY: 'scroll'
  }
}));

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
      <Grid container spacing={1} alignItems="stretch" className={classes.grid}>
        {parties.sort((b, a) => Number(a.subscribed) - Number(b.subscribed)).map((party) => (
          <Grid key={party.publicKey.toString()} item zeroMinWidth>
            <PartyCard party={party} />
          </Grid>
        ))}
      </Grid>

      {parties.length === 0 && (
        <Typography className={classes.createPartyText} variant="h2">
          <a className={classes.createPartyLink} onClick={createParty}>Create a party</a>
          <span> to get started.</span>
        </Typography>
      )}

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
