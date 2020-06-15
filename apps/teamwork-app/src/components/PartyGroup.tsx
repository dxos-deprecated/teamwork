//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

import Grid from '@material-ui/core/Grid';

import { keyToString } from '@dxos/crypto';
import { usePads } from '@dxos/react-appkit';

import { PartyPad } from './PartyPad';
import { Pad } from '../common';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

const useClasses = makeStyles({
  root: {
    marginTop: 32,
    paddingLeft: 20
  },
  grid: {
    paddingTop: 16,
    paddingBottom: 16
  }
});

export interface PartyGroupProps {
  party: any,
}

export const PartyGroup = ({ party }: PartyGroupProps) => {
  const [pads]: Pad[][] = usePads();
  const classes = useClasses();

  return (
    <div className={classes.root}>
      <Typography variant="h4">
        {party.displayName}
      </Typography>
      <Grid container spacing={2} alignItems="stretch" className={classes.grid}>
        {pads.map(pad => (
          <Grid key={pad.type} item zeroMinWidth>
            <PartyPad key={pad.type} pad={pad} topic={keyToString(party.publicKey)} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
