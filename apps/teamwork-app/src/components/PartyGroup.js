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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { keyToString } from '@dxos/crypto';
import { useAppRouter } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';
import { EditableText } from '@dxos/react-ux';

import { useItems } from '../model';
import { PartyMemberList } from './PartyMemberList';
import { DocumentTypeSelectDialog } from '../containers/DocumentTypeSelectDialog';
import { PadIcon } from './PadIcon';
import { ShareDialog } from '../containers/ShareDialog';

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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const router = useAppRouter();

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
      <PartyMemberList party={party} handleUserInvite={() => setShareDialogOpen(true)} />
      <List className={classes.list}>
        {model.getAllViews().map(item => (
          <ListItem key={item.viewId} button onClick={() => handleSelect(item.viewId)}>
            <ListItemIcon>
              <PadIcon type={item.type} />
            </ListItemIcon>
            <ListItemText>
              {item.displayName}
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => model.deleteView(item.viewId)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <ListItem button onClick={() => setTypeSelectDialogOpen(true)}><Add />&nbsp;New document</ListItem>
      </List>
    </Card>
    <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
    <ShareDialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} party={party} />
  </>
  );
};
