//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { AppContainer, PartyCard, PartyCardContainer, IpfsHelper } from '@dxos/react-appkit';
import { useClient, useParties, useConfig } from '@dxos/react-client';

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
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  createPartyLink: {
    cursor: 'pointer',
    color: theme.palette.primary.light
  },
  grid: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    overflowY: 'scroll'
  }
}));

const Home = () => {
  const classes = useStyles();
  const client = useClient();
  const parties = useParties();
  const config = useConfig();

  const [inProgress, setInProgress] = useState(false);
  const [partyFromFileOpen, setPartyFromFileOpen] = useState(false);

  const ipfs = new IpfsHelper(config.ipfs.gateway);

  const createParty = async () => {
    if (inProgress) {
      return;
    }

    setInProgress(true);

    try {
      await client.partyManager.createParty();
    } catch (err) {
      console.error(err);
      throw new Error('Unable to create a party');
    } finally {
      setInProgress(false);
    }
  };

  // TODO(burdon): Factor out party card grid (reusable).
  // TODO(burdon): Toggle show/hide unsubscribed cards (settings?)
  // TODO(burdon): New card should open Settings dialog.

  const sortBySubscribedAndName = (a, b) => {
    const diff = Number(b.subscribed) - Number(a.subscribed);
    if (diff !== 0) {
      return diff;
    }

    return a.displayName < b.displayName ? -1 : 1;
  };

  return (
    <AppContainer
      onPartyFromFile={() => setPartyFromFileOpen(true)}
    >
      <Grid container spacing={4} alignItems="stretch" className={classes.grid}>
        {parties.sort(sortBySubscribedAndName).map((party) => (
          <Grid key={party.publicKey.toString()} item zeroMinWidth>
            <PartyCardContainer party={party} ipfs={ipfs} />
          </Grid>
        ))}
        <Grid item zeroMinWidth>
          <PartyCard
            onNewParty={createParty}
            partyFromFileOpen={partyFromFileOpen}
            onPartyFromFileClosed={() => setPartyFromFileOpen(false)}
            client={client}
          />
        </Grid>
      </Grid>
    </AppContainer>
  );
};

export default Home;
