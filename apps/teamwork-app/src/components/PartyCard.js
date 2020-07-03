//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import { Chance } from 'chance';
import React, { useState, useRef } from 'react';

import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Clear';
import RestoreIcon from '@material-ui/icons/RestoreFromTrash';

import { keyToString } from '@dxos/crypto';
import { useAppRouter } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';
import { EditableText } from '@dxos/react-ux';

import { useItems } from '../model';

// TODO(burdon): Export default.
import { DocumentTypeSelectMenu } from './DocumentTypeSelectMenu';
import { ShareDialog } from '../containers/ShareDialog';

import PartySettingsMenu from './PartySettingsMenu';
import { PartyMemberList } from './PartyMemberList';
import { PadIcon } from './PadIcon';

// TODO(burdon): Move out of UX.
const chance = new Chance();

// TODO(burdon): Factor out.
const images = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSe8ES_7-v2Xc05crmmatnR7Yk0ADX6POUCzfcX3F35fwX25d4ovtCHMB4o7-1V6GuTF29Qypt469VOU6fwgl2D7knQ--wBpGT1QcULHY36SwIFzbxShz8luKQoSZ538rofMMuILS9JxZb5c94Yt_GOMKxFQl7Qonn5REIo2ET89V-yZEfqFGD0kT1AEFBT9vSdvsByd4H3gS_Bh4ByBIvR8L2glSlidtklazlFnTonV7TMCl0Kl2CFXbhk9EXEpzkOT4gE9XWFk9tOh_lWcRQYiLgZdV8-6CjIE2A_BiBSW_3uHMQiguOJWVzt-0xPrlf1DRg89H_gCSfCZOQ7YNZUOOeGpnT2lXS5M9prwCfOt-TltfloDWg5FxwMqvK9i8h3Q-rptfsEljgZticHeUaB0USXA12omPT-Qgi7faYBZYZ0tzC7oe39WgY&usqp=CAU',
  'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX6648388.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSiYt6aRQEKRUqW8gpnwsB3PJAxlu-ydJxfgg&usqp=CAU',
];

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: 300
  },
  unsubscribed: {
    backgroundColor: theme.palette.grey[500]
  },

  header: {
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1),
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  actions: {
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },

  listContainer: {
    height: 200,
    overflowY: 'scroll'
  },
  list: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
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

  // TODO(burdon): Single return path.
  if (!party.subscribed) {
    return (
      <>
        <Card className={clsx(classes.card, classes.unsubscribed)}>
          <CardHeader
            classes={{ root: classes.header }}
            title={<p>{party.displayName}</p>}
          />

          <CardActions className={classes.actions}>
            <Button
              size="small"
              color="secondary"
              onClick={handleSubscribe}
            >
              Subscribe
            </Button>
          </CardActions>
        </Card>
      </>
    );
  }

  // TODO(burdon): Fix EditableText (component). Edit name via setting panel.
  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          classes={{ root: classes.header }}
          title={
            <EditableText
              classes={{ root: classes.title }}
              value={party.displayName}
              onUpdate={(displayName) => client.partyManager.setPartyProperty(party.publicKey, { displayName })}
            />
          }
          action={
            <IconButton
              aria-label="party menu"
              ref={partySettingsMenuAnchor}
              onClick={() => setPartySettingsMenuOpen(true)}
            >
              <MoreVertIcon />
            </IconButton>
          }
        />

        <CardMedia
          className={classes.media}
          component="img"
          height={140}
          image={images[party.displayName.length % images.length]}
        />

        <div className={classes.listContainer}>
          <List className={classes.list} dense={true} disablePadding={true}>
            {model.getAllViews().map(item => (
              <ListItem key={item.viewId} button onClick={() => handleSelect(item.viewId)}>
                <ListItemIcon>
                  <PadIcon type={item.type} />
                </ListItemIcon>
                <ListItemText>
                  {item.displayName}
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton size="small" edge="end" aria-label="delete" onClick={() => model.deleteView(item.viewId)}>
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
                    <RestoreIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>

        <CardActions className={classes.actions}>
          <PartyMemberList party={party} onUserInvite={() => setShareDialogOpen(true)} />

          <IconButton
            ref={newDocumentAnchor}
            size="small"
            edge="end"
            aria-label="add view"
            onClick={() => setTypeSelectDialogOpen(true)}
          >
            <AddIcon />
          </IconButton>
        </CardActions>
      </Card>

      {/* TODO(burdon): Rename View. */}
      <DocumentTypeSelectMenu
        anchorEl={newDocumentAnchor.current}
        open={typeSelectDialogOpen}
        onSelect={handleCreate}
      />

      <PartySettingsMenu
        anchorEl={partySettingsMenuAnchor.current}
        open={partySettingsMenuOpen}
        deletedItemsVisible={deletedItemsVisible}
        onClose={() => setPartySettingsMenuOpen(false)}
        onVisibilityToggle={() => setDeletedItemsVisible(prev => !prev)}
        onUnsubscribe={handleUnsubscribe}
      />

      <ShareDialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} party={party} />
    </>
  );
};
