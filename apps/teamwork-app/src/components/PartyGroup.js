//
// Copyright 2020 DXOS.org
//

import React, { useState, useRef } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Add } from '@material-ui/icons';
import CardHeader from '@material-ui/core/CardHeader';
import { Chance } from 'chance';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import { keyToString } from '@dxos/crypto';
import { useAppRouter } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';
import { EditableText } from '@dxos/react-ux';

import { useItems } from '../model';
import { PartyMemberList } from './PartyMemberList';
import { DocumentTypeSelectMenu } from '../containers/DocumentTypeSelectMenu';
import { PadIcon } from './PadIcon';
import { ShareDialog } from '../containers/ShareDialog';
import { Avatar } from '@material-ui/core';
import { PartySettingsMenu } from '../containers/PartySettingsMenu';

const chance = new Chance();

const useClasses = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 390,
    width: 300
  },
  unsubscribedCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 300,
    width: 300,
    backgroundColor: 'grey'
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
  actions: {
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginLeft: 'auto'
  },
  titleRoot: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 180
  }
});

export const PartyGroup = ({ party }) => {
  const topic = keyToString(party.publicKey);
  const model = useItems(topic);
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);
  const [partySettingsMenuOpen, setPartySettingsMenuOpen] = useState(false);
  const classes = useClasses();
  const client = useClient();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deletedItemsVisible, setDeletedItemsVisible] = useState(false);
  const router = useAppRouter();
  const newDocumentAnchor = useRef();
  const partySettingsMenuAnchor = useRef();

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

  const onUnsubscribe = async () => {
    await client.partyManager.unsubscribe(party.publicKey);
  };

  const onSubscribe = async () => {
    await client.partyManager.subscribe(party.publicKey);
  };

  if (!party.subscribed) {
    return (<>
      <Card className={classes.unsubscribedCard}>
        <CardHeader
          title={<p>{party.displayName}</p>}
        />
        <CardActions className={classes.actions}>
          <Button
            size="small"
            color="secondary"
            onClick={onSubscribe}
          >Resubscribe</Button>
        </CardActions>
      </Card>
    </>
    );
  }

  return (<>
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label={party.displayName}>
            {party.displayName.slice(0, 1).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" ref={partySettingsMenuAnchor} onClick={() => setPartySettingsMenuOpen(true)}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <EditableText
            variant='h6'
            value={party.displayName}
            onUpdate={(displayName) => client.partyManager.setPartyProperty(party.publicKey, { displayName })}
            classes={{ root: classes.titleRoot }}
          />
        }
      />
      <PartySettingsMenu
        anchorEl={partySettingsMenuAnchor.current}
        open={partySettingsMenuOpen}
        onClose={() => setPartySettingsMenuOpen(false)}
        onVisibilityToggle={() => setDeletedItemsVisible(prev => !prev)}
        onUnsubscribe={onUnsubscribe}
        deletedItemsVisible={deletedItemsVisible}
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
        {deletedItemsVisible && model.getAllDeletedViews().map(item => (
          <ListItem key={item.viewId} disabled={true}>
            <ListItemIcon>
              <PadIcon type={item.type} />
            </ListItemIcon>
            <ListItemText>
              {item.displayName}
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="restore" onClick={() => model.restoreView(item.viewId)}>
                <RestoreFromTrashIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <DocumentTypeSelectMenu anchorEl={newDocumentAnchor.current} open={typeSelectDialogOpen} onSelect={handleCreate} />
      </List>
      <CardActions className={classes.actions}>
        <Button
          ref={newDocumentAnchor}
          size="small"
          color="secondary"
          startIcon={<Add />}
          onClick={() => setTypeSelectDialogOpen(true)}
        >New document</Button>
      </CardActions>

    </Card>
    <ShareDialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} party={party} />
  </>
  );
};
