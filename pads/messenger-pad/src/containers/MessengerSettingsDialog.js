//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/icons/AssignmentTurnedIn';

import { ItemSettings, download } from '@dxos/react-appkit';

import { useChannelMessages } from '../model';
import serializeChat from '../serialize-chat';

const useStyles = makeStyles(theme => ({
  settingsItem: {
    marginTop: theme.spacing(2)
  }
}));

export const MessengerSettingsDialog = ({ topic, open, onClose, onCancel, item }) => {
  const [messages] = useChannelMessages(topic, (item && item.id) || 'creating-item');
  const classes = useStyles();

  const handleDownload = () => {
    assert(item);
    download(serializeChat(item, messages), `${item.model.getProperty('title') || 'chat-log'}.md`);
  };

  const handleClose = ({ name }) => {
    if (item) {
      item.model.setProperty('title', name);
    }
    onClose({ name });
  };

  return (
    <ItemSettings
      open={open}
      onClose={handleClose}
      onCancel={onCancel}
      item={item}
      closingDisabled={false}
      icon={<Icon />}
    >
      {item && (
        <Button
          variant="outlined"
          size="small"
          disabled={false}
          onClick={handleDownload}
          className={classes.settingsItem}
        >
          Download chat log
        </Button>
      )}
    </ItemSettings>
  );
};

export default MessengerSettingsDialog;
