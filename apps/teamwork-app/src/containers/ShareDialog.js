//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import LinkIcon from '@material-ui/icons/Link';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Button } from '@material-ui/core';

import { humanize } from '@dxos/crypto';
import { useClient, useParties } from '@dxos/react-client';
import { generatePasscode } from '@dxos/credentials';
import { useAppRouter } from '@dxos/react-appkit';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  copyButton: {
    marginLeft: 16,
    marginRight: 16
  }
});

export const ShareDialog = ({ party, open, onClose }) => {
  const classes = useStyles();
  const client = useClient();
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const router = useAppRouter();

  const createInvitation = async () => {
    const invitation = await client.partyManager.inviteToParty(
      party.publicKey,
      (invitation, secret) => secret && secret.equals(invitation.secret),
      () => {
        const passcode = generatePasscode();
        setPendingInvitations(arr => arr.map(x => x.invitation === invitation ? { ...x, passcode } : x));
        return Buffer.from(passcode);
      },
      {
        onFinish: () => setPendingInvitations(arr => arr.filter(x => x.invitation !== invitation))
      }
    );
    return invitation;
  };

  const onNewPendingInvitation = async () => {
    const invitation = await createInvitation();
    setPendingInvitations(old => [...old, { invitation }]);
  };

  const onRecreate = async (pending) => {
    const recreatedInvitation = await createInvitation();
    setPendingInvitations(arr => arr.map(x => x.invitation === pending ? { invitation: recreatedInvitation } : x));
  };

  const parties = useParties();
  const otherMembers = parties
    .flatMap(party => party.members)
    .filter(member => !party.members.some(m => m.publicKey.toString('hex') === member.publicKey.toString('hex')));

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>DXOS Party sharing</DialogTitle>
      <DialogContent>
        <Typography>{`This party has ${party.members.length} collaborators. Adding a party collaborator will give them access to all views within this party.`}</Typography>

        <Button
          size="small"
          variant="outlined"
          // className={classes.openButton}
          onClick={onNewPendingInvitation}
        >Create invite link</Button>

        <DialogTitle variant="h5">Collaborators</DialogTitle>
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableBody>
              {pendingInvitations.map((pending) => (
                <TableRow key={pending.invitation.secret}>
                  <TableCell>
                    Copy link
                    <CopyToClipboard text={router.createInvitationUrl(pending.invitation)} onCopy={value => console.log(value)} className={classes.copyButton}>
                      <IconButton
                        color="inherit"
                        aria-label="copy to clipboard"
                        title="Copy to clipboard"
                        edge="start"
                      >
                        <LinkIcon />
                      </IconButton>
                    </CopyToClipboard>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onRecreate(pending)}
                    >Recreate</Button>
                  </TableCell>
                  <TableCell>{pending.passcode ?? '...'}</TableCell>
                </TableRow>
              ))}
              {party.members.map((member) => (
                <TableRow key={member.publicKey}>
                  <TableCell>{member.displayName || humanize(member.publicKey)}</TableCell>
                  <TableCell>Collaborator</TableCell>
                </TableRow>
              ))}
              {otherMembers.map(member => (
                <TableRow key={member.publicKey}>
                  <TableCell>{member.displayName || humanize(member.publicKey)}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                    >Invite</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};
