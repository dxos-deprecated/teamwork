//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';

import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';

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

  // TODO(burdon): Factor out grid.
  // TODO(burdon): Show blank card with "+ Add project" button (See https://console.firebase.google.com)

  return (
    <AppContainer>
      <Grid container spacing={4} alignItems="stretch" className={classes.grid}>
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
            {inProgress ? <CircularProgress color="secondary" /> : <AddIcon /> }
          </Fab>
        </Tooltip>
      </Zoom>
    </AppContainer>
  );
};
