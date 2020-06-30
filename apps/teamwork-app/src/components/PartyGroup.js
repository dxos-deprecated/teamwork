//
// Copyright 2020 DXOS.org
//

import React, { useState, useRef } from 'react';
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
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import CardActions from '@material-ui/core/CardActions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
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

const chance = new Chance();

const useClasses = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 600,
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
  labelText: {
    fontSize: '1.5em',
    fontWeight: 'inherit',
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  actions: {
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginLeft: 'auto'
  }
});

export const PartyGroup = ({ party }) => {
  const topic = keyToString(party.publicKey);
  const model = useItems(topic);
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);
  const classes = useClasses();
  const client = useClient();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deletedItemsVisible, setDeletedItemsVisible] = useState(false);
  const router = useAppRouter();
  const anchor = useRef();

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

        <ListItem ref={anchor} button onClick={() => setTypeSelectDialogOpen(true)}><Add />&nbsp;New document</ListItem>
        <DocumentTypeSelectMenu anchorEl={anchor.current} open={typeSelectDialogOpen} onSelect={handleCreate} />
      </List>
      <CardActions className={classes.actions}>
        <Button
          size="small"
          color="secondary"
          onClick={onUnsubscribe}
        >Unsubscribe</Button>
        <Button
          size="small"
          color="secondary"
          startIcon={deletedItemsVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={() => setDeletedItemsVisible(prev => !prev)}
        >
          {deletedItemsVisible ? 'Hide deleted' : 'Show deleted'}
        </Button>
      </CardActions>
    </Card>
    <ShareDialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} party={party} />
  </>
  );
};
