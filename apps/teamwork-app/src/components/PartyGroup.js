//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

import { keyToString } from '@dxos/crypto';
import { usePads, InvitationDialog, useAppRouter } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';
import { generatePasscode } from '@dxos/credentials';

import { PartyPad } from './PartyPad';
import { NewPad } from './NewPad';
import { PartyMembers } from './PartyMembers';
import { useItemList } from '../model';

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

export const PartyGroup = ({ party }) => {
  const [pads] = usePads();
  const topic = keyToString(party.publicKey);
  const { items, createItem } = useItemList(topic, pads.map(pad => pad.type));
  const classes = useClasses();
  const client = useClient();
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [passcode, setPasscode] = useState(null);
  const router = useAppRouter();

  const handleUserInvite = async () => {
    const invitation = await client.partyManager.inviteToParty(
      party.publicKey,
      (invitation, secret) => secret && secret.equals(invitation.secret),
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

  const padsWithItems = pads.filter(pad => items.some(item => item.__type_url === pad.type));

  return (
    <div className={classes.root}>
      <Typography variant="h4">
        {party.displayName}
      </Typography>
      <Grid container spacing={2} alignItems="stretch" className={classes.grid}>
        <Grid item zeroMinWidth>
          <PartyMembers party={party} handleUserInvite={handleUserInvite} />
        </Grid>
        {padsWithItems.map(pad => (
          <Grid key={pad.type} item zeroMinWidth>
            <PartyPad items={items.filter(item => item.__type_url === pad.type)} createItem={createItem} key={pad.type} pad={pad} topic={keyToString(party.publicKey)} />
          </Grid>
        ))}
        { padsWithItems.length < pads.length && (
          <Grid item zeroMinWidth>
            <NewPad createItem={createItem} topic={keyToString(party.publicKey)} />
          </Grid>
        )
        }
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
