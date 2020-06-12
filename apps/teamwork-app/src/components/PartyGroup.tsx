//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';


import Grid from '@material-ui/core/Grid';

import { keyToString } from '@dxos/crypto';
import { usePads } from '@dxos/react-appkit';

import { PartyPad } from './PartyPad';
import { Pad } from '../common';

export interface PartyGroupProps {
  party: any,
}

export const PartyGroup = ({ party }: PartyGroupProps) => {
  const [pads]: Pad[][] = usePads();

  return (<>
    <h3>{party.displayName}</h3>
    <Grid container spacing={2} alignItems="stretch">
      {pads.map(pad => (
        <Grid item zeroMinWidth>
          <PartyPad key={pad.type} pad={pad} topic={keyToString(party.publicKey)} />
        </Grid>
      ))}
    </Grid>
  </>);
};
