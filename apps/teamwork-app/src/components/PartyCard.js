//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import { Chance } from 'chance';
import React, { useState, useRef } from 'react';

import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';

import { Add } from '@material-ui/icons';

import { keyToString } from '@dxos/crypto';
import { useAppRouter } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';
import { EditableText } from '@dxos/react-ux';

import { useItems } from '../model';
import { DocumentTypeSelectMenu } from '../containers/DocumentTypeSelectMenu';
import { PartySettingsMenu } from '../containers/PartySettingsMenu';
import { ShareDialog } from '../containers/ShareDialog';

import { PartyMemberList } from './PartyMemberList';
import { PadIcon } from './PadIcon';

// TODO(burdon): Move out of UX.
const chance = new Chance();

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 380,
    width: 300
  },
  unsubscribed: {
    backgroundColor: 'grey'     // TODO(burdon): Use theme.
  },
  header: {
    backgroundColor: '#F5F5F5'
  },
  listContainer: {
    flex: 1
  },
  list: {
    overflowY: 'scroll'
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
}));

// TODO(burdon): Move to react-appkit.
export const PartyCard = ({ party }) => {
  const classes = useStyles();
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);
  const [partySettingsMenuOpen, setPartySettingsMenuOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deletedItemsVisible, setDeletedItemsVisible] = useState(false);
  const newDocumentAnchor = useRef();
  const partySettingsMenuAnchor = useRef();

  // TODO(burdon): This should be a dumb component (not container), so must pass in handlers.
  const topic = keyToString(party.publicKey);
  const model = useItems(topic);
  const client = useClient();
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

  const handleSubscribe = async () => {
    await client.partyManager.subscribe(party.publicKey);
  };

  const handleUnsubscribe = async () => {
    await client.partyManager.unsubscribe(party.publicKey);
  };

  if (!party.subscribed) {
    return (<>
      <Card className={clsx(classes.card, classes.unsubscribed)}>
        <CardHeader
          title={<p>{party.displayName}</p>}
        />
        <CardActions className={classes.actions}>
          <Button
            size="small"
            color="secondary"
            onClick={handleSubscribe}
          >Resubscribe</Button>
        </CardActions>
      </Card>
    </>
    );
  }

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          classes={{ root: classes.header }}
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
          onUnsubscribe={handleUnsubscribe}
          deletedItemsVisible={deletedItemsVisible}
        />

        <div className={classes.listContainer}>
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
        </div>

        <PartyMemberList party={party} handleUserInvite={() => setShareDialogOpen(true)} />

        <CardActions className={classes.actions}>
          <Button
            ref={newDocumentAnchor}
            size="small"
            color="secondary"
            startIcon={<Add />}
            onClick={() => setTypeSelectDialogOpen(true)}
          >
            New Document
          </Button>
        </CardActions>

      </Card>
      <ShareDialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} party={party} />
    </>
  );
};
