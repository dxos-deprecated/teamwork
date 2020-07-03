//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles, withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import FaceIcon from '@material-ui/icons/Face';
import LinkIcon from '@material-ui/icons/Link';
import RefreshIcon from '@material-ui/icons/Refresh';

import { humanize } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { generatePasscode } from '@dxos/credentials';
import { useAppRouter } from '@dxos/react-appkit';

import { MemberAvatar } from '../components/MemberAvatar';
import { useAsync } from '../hooks/useAsync';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  expand: {
    display: 'flex',
    flex: 1
  }
}));

const TableCell = withStyles({
  root: {
    borderBottom: 'none'
  }
})(MuiTableCell);

export const ShareDialog = ({ party, open, onClose }) => {
  const classes = useStyles();
  const client = useClient();
  const router = useAppRouter();
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [contacts, error] = useAsync(async () => client.partyManager.getContacts(), []);

  const createInvitation = async () => {
    const invitation = await client.partyManager.inviteToParty(
      party.publicKey,
      (invitation, secret) => secret && secret.equals(invitation.secret),
      () => {
        const passcode = generatePasscode();
        // TODO(burdon): Don't use generic variable names like "arr" and "x"
        setPendingInvitations(arr => arr.map(x => x.invitation === invitation ? { ...x, passcode } : x));
        return Buffer.from(passcode);
      },
      {
        onFinish: () => setPendingInvitations(arr => arr.filter(x => x.invitation !== invitation))
      }
    );
    return invitation;
  };

  const handleNewPendingInvitation = async () => {
    const invitation = await createInvitation();
    setPendingInvitations(old => [...old, { invitation }]);
  };

  const handleRecreateLink = async (pending) => {
    const recreatedInvitation = await createInvitation();
    setPendingInvitations(
      arr => arr.map(x => x.invitation === pending.invitation ? { invitation: recreatedInvitation } : x));
  };

  // TODO(burdon): THIS SHOULD NOT BE HERE.
  if (error) throw error;

  // TODO(burdon): Columns in EACH section should have same content:
  // [SMALL AVATAR] [NAME] [INVITATION PIN] [MEMBER TYPE] [ACTIONS: e.g., refresh PIN/remove]

  // TODO(burdon): Use standard Dialog layout (e.g., "DONE" in footer -- see appkit Registration dialog)

  return (
    <Dialog open={open} maxWidth="md" onClose={onClose}>
      <DialogTitle>Share with People and Bots</DialogTitle>
      <DialogContent>

        <Toolbar variant="dense" disableGutters={true}>
          <Typography variant="h6">Members</Typography>

          <div className={classes.expand} />

          <div>
            <Button
              size="small"
              onClick={handleNewPendingInvitation}
            >
              Get Link
            </Button>
          </div>
        </Toolbar>

        <TableContainer>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableBody>
              {pendingInvitations.map((pending) => (
                <TableRow key={pending.invitation.secret}>
                  <TableCell>
                    <Avatar>
                      <FaceIcon />
                    </Avatar>
                  </TableCell>
                  <TableCell />
                  <TableCell>
                    {pending.passcode && (
                      <>
                        <span>Passcode: {pending.passcode}</span>

                        <IconButton
                          size="small"
                          onClick={() => handleRecreateLink(pending)}
                          title="Regenerate PIN"
                        >
                          <RefreshIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>
                    <CopyToClipboard
                      text={router.createInvitationUrl(pending.invitation)}
                      onCopy={value => console.log(value)}
                    >
                      <IconButton
                        size="small"
                        color="inherit"
                        aria-label="copy to clipboard"
                        title="Copy to clipboard"
                        edge="start"
                      >
                        <LinkIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableBody>
              {party.members.map((member) => (
                <TableRow key={member.publicKey}>
                  <TableCell padding="checkbox">
                    <MemberAvatar member={member} />
                  </TableCell>
                  <TableCell>
                    {member.displayName || humanize(member.publicKey)}
                  </TableCell>
                  <TableCell />
                  <TableCell>Member</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableBody>
              {contacts && contacts.map(contact => (
                <TableRow key={contact.publicKey}>
                  <TableCell padding="checkbox">
                    <MemberAvatar member={contact} />
                  </TableCell>
                  <TableCell>
                    {contact.displayName || humanize(contact.publicKey)}
                  </TableCell>
                  <TableCell>
                    <Button size="small">
                      Invite
                    </Button>
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
