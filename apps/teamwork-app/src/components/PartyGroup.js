//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Chance } from 'chance';

import { keyToString } from '@dxos/crypto';
import { usePads, InvitationDialog, useAppRouter } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';
import { generatePasscode } from '@dxos/credentials';

import { PartyMembers } from './PartyMembers';
import { useItemList } from '../model';
import { DocumentTypeSelectDialog } from '../containers/DocumentTypeSelectDialog';

const chance = new Chance();

const useClasses = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 600,
    width: 300,
    overflowY: 'scroll'
  },
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

  const onSelect = (item) => {
    router.push({ topic, item: item.viewId });
  };

  const handleSelect = (viewId) => {
    router.push({ topic, item: viewId });
  };

  const handleCreate = (type) => {
    setTypeSelectDialogOpen(false);
    if (!type) return;
    const title = `item-${chance.word()}`;
    const viewId = createItem(type, title);
    handleSelect(viewId);
  };

  const padsWithItems = pads.filter(pad => items.some(item => item.__type_url === pad.type));

  return (<>
    <Card className={classes.card}>
      <CardHeader
        title={party.displayName}
      />
      <List className={classes.list}>
        {padsWithItems.map(pad => (
          <>
            {items.filter(item => item.__type_url === pad.type).map(item => (
              <ListItem key={item.viewId} button onClick={() => onSelect(item)}><span><pad.icon /> {item.title}</span></ListItem>
            ))}
          </>
        ))}
      </List>
      <PartyMembers party={party} />
      <CardActions>
        <Button size="small" color="primary" onClick={() => setTypeSelectDialogOpen(true)}>New document</Button>
        <Button size="small" color="primary" onClick={handleUserInvite}>New member</Button>
      </CardActions>
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
