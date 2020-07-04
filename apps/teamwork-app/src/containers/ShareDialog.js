//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles, withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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

import DeleteIcon from '@material-ui/icons/Clear';
import FaceIcon from '@material-ui/icons/Face';
import LinkIcon from '@material-ui/icons/Link';
import RefreshIcon from '@material-ui/icons/Refresh';
import InviteIcon from '@material-ui/icons/Add';
import PeopleIcon from '@material-ui/icons/People';

import { humanize } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { generatePasscode } from '@dxos/credentials';
import { useAppRouter } from '@dxos/react-appkit';

import { MemberAvatar } from '../components/MemberAvatar';
import { useAsync } from '../hooks/useAsync';

const useStyles = makeStyles(theme => ({
  title: {
    marginLeft: theme.spacing(2)
  },
  table: {
    minWidth: 650,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  expand: {
    display: 'flex',
    flex: 1
  },
  label: {
    fontVariant: 'all-small-caps'
  },
  passcode: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.dark}`
  },
  colAvatar: {
    width: 60
  },
  colPasscode: {
    width: 160
  },
  colStatus: {
    width: 100
  },
  colActions: {
    width: 60,
    textAlign: 'right'
  }
}));

const TableCell = withStyles(theme => ({
  root: {
    borderBottom: 'none',
    padding: 0,
    paddingBottom: theme.spacing(0.5)
  }
}))(MuiTableCell);

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
      <DialogTitle>
        <Toolbar variant="dense" disableGutters={true}>
          <Avatar>
            <PeopleIcon />
          </Avatar>

          <Typography variant="h5" className={classes.title}>Share with People and Bots</Typography>
        </Toolbar>
      </DialogTitle>

      <DialogContent>
        <Toolbar variant="dense" disableGutters={true}>
          <div>
            <Button
              size="small"
              onClick={handleNewPendingInvitation}
            >
              Invite User
            </Button>
          </div>
        </Toolbar>

        <TableContainer>
          <Table className={classes.table} size="small" padding="none" aria-label="contacts">
            <TableBody>
              {pendingInvitations.map((pending) => (
                <TableRow key={pending.invitation.secret}>
                  <TableCell classes={{ root: classes.colAvatar }}>
                    <Avatar>
                      <FaceIcon />
                    </Avatar>
                  </TableCell>
                  <TableCell />
                  <TableCell classes={{ root: classes.colPasscode }}>
                    {pending.passcode && (
                      <>
                        <span className={classes.label}>Passcode</span>
                        <span className={classes.passcode}>{pending.passcode}</span>
                      </>
                    )}
                  </TableCell>
                  <TableCell classes={{ root: classes.colStatus }}>
                    <span className={classes.label}>Pending</span>
                  </TableCell>
                  <TableCell classes={{ root: classes.colActions }}>
                    {pending.passcode ? (
                      <IconButton
                        size="small"
                        onClick={() => handleRecreateLink(pending)}
                        title="Regenerate PIN"
                      >
                        <RefreshIcon />
                      </IconButton>
                    ) : (
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
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableBody>
              {party.members.map((member) => (
                <TableRow key={member.publicKey}>
                  <TableCell classes={{ root: classes.colAvatar }}>
                    <MemberAvatar member={member} />
                  </TableCell>
                  <TableCell>
                    {member.displayName || humanize(member.publicKey)}
                  </TableCell>
                  <TableCell />
                  <TableCell classes={{ root: classes.colStatus }}>
                    <span className={classes.label}>Member</span>
                  </TableCell>
                  <TableCell classes={{ root: classes.colActions }}>
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
                  <TableCell classes={{ root: classes.colAvatar }}>
                    <MemberAvatar member={contact} />
                  </TableCell>
                  <TableCell>
                    {contact.displayName || humanize(contact.publicKey)}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell classes={{ root: classes.colActions }}>
                    <IconButton size="small">
                      <InviteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
