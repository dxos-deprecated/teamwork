//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import { Add } from '@material-ui/icons';
import CardHeader from '@material-ui/core/CardHeader';
import { Chance } from 'chance';

import { keyToString } from '@dxos/crypto';
import { usePads, InvitationDialog, useAppRouter } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';
import { generatePasscode } from '@dxos/credentials';
import { EditableText } from '@dxos/react-ux';

import { useItems } from '../model';
import { PartyMemberList } from './PartyMemberList';
import { DocumentTypeSelectDialog } from '../containers/DocumentTypeSelectDialog';

const chance = new Chance();

const useClasses = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 600,
    width: 300
  },
  list: {
    overflowY: 'scroll'
  },
  root: {
    marginTop: 32,
    paddingLeft: 20
  },
  grid: {
    paddingTop: 16,
    paddingBottom: 16
  },
  labelText: {
    fontSize: '1.5em',
    fontWeight: 'inherit',
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});

export const PartyGroup = ({ party }) => {
  const topic = keyToString(party.publicKey);
  const model = useItems(topic);
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);
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

  const handleSelect = (viewId) => {
    router.push({ topic, item: viewId });
  };

  const handleCreate = (type) => {
    setTypeSelectDialogOpen(false);
    if (!type) return;
    const title = `item-${chance.word()}`;
    const viewId = model.createView(type, title);
    handleSelect(viewId);
  };

  const [pads] = usePads();
  const iconFor = type => {
    const pad = pads.find(pad => pad.type === type);
    return pad ? <pad.icon /> : null;
  };

  return (<>
    <Card className={classes.card}>
      <CardHeader
        title={
          <EditableText
            value={party.displayName}
            onUpdate={(displayName) => client.partyManager.setPartyProperty(party.publicKey, { displayName })}
            className={classes.labelText}
          />
        }
      />
      <PartyMemberList party={party} handleUserInvite={handleUserInvite} />
      <List className={classes.list}>
        {model.getAllViews().map(item => (
          <ListItem key={item.viewId} button onClick={() => handleSelect(item)}>{iconFor(item.type)}&nbsp;{item.displayName}</ListItem>
        ))}
        <ListItem button onClick={() => setTypeSelectDialogOpen(true)}><Add />&nbsp;New document</ListItem>
      </List>
    </Card>
    <InvitationDialog
      open={invitationDialogOpen}
      link={invitation && router.createInvitationUrl(invitation)}
      passcode={passcode}
      title="Authorize Device"
      message={passcode ? 'The peer has connected.' : 'A passcode will be generated once the remote peer connects.'}
      onClose={() => setInvitationDialogOpen(false)}
    />
    <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
  </>
  );
};
