//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { keyToString } from '@dxos/crypto';
import {
  AppContainer,
  PartyCard,
  PartyCardContainer,
  IpfsHelper,
  PartyFromFileDialog,
  PartyFromIpfsDialog
} from '@dxos/react-appkit';
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
  const [partyFromIpfsOpen, setPartyFromIpfsOpen] = useState(false);

  const ipfs = new IpfsHelper(config.services.ipfs.gateway);

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

  const handleImport = async (data) => {
    const parsed = JSON.parse(data);
    assert(Array.isArray(parsed));
    const newParty = await client.partyManager.createParty();
    const newPartyTopic = keyToString(newParty.key);
    const newPartyModel = await client.modelFactory.createModel(undefined, { type: [], topic: newPartyTopic });
    parsed.forEach(msg => newPartyModel.appendMessage(msg));
  };

  return (
    <AppContainer
      onPartyFromFile={() => setPartyFromFileOpen(true)}
      onPartyFromIpfs={() => setPartyFromIpfsOpen(true)}
    >
      <Grid container spacing={4} alignItems="stretch" className={classes.grid}>
        {parties.sort(sortBySubscribedAndName).map((party) => (
          <Grid key={party.key.toString()} item zeroMinWidth>
            <PartyCardContainer party={party} ipfs={ipfs} />
          </Grid>
        ))}
        <Grid item zeroMinWidth>
          <PartyCard
            onNewParty={createParty}
            client={client}
          />
        </Grid>
      </Grid>
      <PartyFromFileDialog
        open={partyFromFileOpen}
        onClose={() => setPartyFromFileOpen(false)}
        onImport={handleImport}
      />
      <PartyFromIpfsDialog
        open={partyFromIpfsOpen}
        onClose={() => setPartyFromIpfsOpen(false)}
        onImport={handleImport}
        ipfs={ipfs}
      />
    </AppContainer>
  );
};

export default Home;
