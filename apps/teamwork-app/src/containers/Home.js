//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { schema } from '@dxos/echo-protocol';
import {
  AppContainer,
  PartyCard,
  PartyCardContainer,
  IpfsHelper,
  PartyFromFileDialog,
  PartyFromIpfsDialog,
  PartiesSettingsDialog
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
    overflowY: 'auto'
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
  const [partiesSettingsOpen, setPartiesSettingsOpen] = useState(false);
  const [showInactiveParties, setShowInactiveParties] = useState(true);

  const ipfs = new IpfsHelper(config.ipfs.gateway);

  const createParty = async () => {
    if (inProgress) {
      return;
    }

    setInProgress(true);

    try {
      await client.echo.createParty();
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
    const bufferData = Buffer.from(data, 'hex');
    const decodedSnapshot = schema.getCodecForType('dxos.echo.snapshot.DatabaseSnapshot').decode(bufferData);

    await client.createPartyFromSnapshot(decodedSnapshot);
  };

  const handleInactivePartiesVisibility = () => {
    setShowInactiveParties(currentVisibility => !currentVisibility);
  };

  return (
    <AppContainer
      onPartyFromFile={() => setPartyFromFileOpen(true)}
      onPartyFromIpfs={() => setPartyFromIpfsOpen(true)}
      onPartiesSettingsOpen={() => setPartiesSettingsOpen(true)}
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
      <PartiesSettingsDialog
        open={partiesSettingsOpen}
        showInactiveParties={showInactiveParties}
        onClose={() => setPartiesSettingsOpen(false)}
        onToggleInactiveParties={handleInactivePartiesVisibility}
      />
    </AppContainer>
  );
};

export default Home;

// TODO: use from echo-db
export function sortItemsTopologically (items) {
  const snapshots = [];
  const seenIds = new Set();

  while (snapshots.length !== items.length) {
    const prevLength = snapshots.length;
    for (const item of items) {
      assert(item.itemId);
      if (!seenIds.has(item.itemId) && (item.parentId == null || seenIds.has(item.parentId))) {
        snapshots.push(item);
        seenIds.add(item.itemId);
      }
    }
    if (prevLength === snapshots.length && snapshots.length !== items.length) {
      throw new Error('Cannot topologically sorts items in snapshot: some parents are missing.');
    }
  }

  return snapshots;
}
