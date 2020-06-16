//
// Copyright 2020 DxOS, Inc.
//

import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { keyToString } from '@dxos/crypto';
import { usePads, InvitationDialog, useAppRouter } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';
import { generatePasscode } from '@dxos/credentials';

import { PartyPad } from './PartyPad';
import { Pad } from '../common';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { PartyMembers } from './PartyMembers';

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
  const client = useClient();
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [passcode, setPasscode] = useState(null);
  const router = useAppRouter();

  const handleUserInvite = async () => {
    const invitation = await client.partyManager.inviteToParty(
      party.publicKey,
      (invitation: any, secret: any) => secret && secret.equals(invitation.secret),
      () => {
        const passcode = generatePasscode();
        setPasscode(passcode);
        return Buffer.from(passcode);
      },
      {
        onFinish: () => setInvitationDialogOpen(false)
      }
    );

    setInvitation(invitation);
    setPasscode(null);

    setInvitationDialogOpen(true);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4">
        {party.displayName}
      </Typography>
      <Grid container spacing={2} alignItems="stretch" className={classes.grid}>
        <Grid item zeroMinWidth>
          <PartyMembers party={party} handleUserInvite={handleUserInvite} />
        </Grid>
        {pads.map(pad => (
          <Grid key={pad.type} item zeroMinWidth>
            <PartyPad key={pad.type} pad={pad} topic={keyToString(party.publicKey)} />
          </Grid>
        ))}
      </Grid>
      <InvitationDialog
        open={invitationDialogOpen}
        link={invitation && router.createInvitationUrl(invitation)}
        passcode={passcode}
        title="Authorize Device"
        message={passcode ? 'The peer has connected.' : 'A passcode will be generated once the remote peer connects.'}
        onClose={() => setInvitationDialogOpen(false)}
      />
    </div>
  );
};
