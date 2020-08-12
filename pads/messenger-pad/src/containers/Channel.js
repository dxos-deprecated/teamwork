//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import clsx from 'clsx';
import React, { useState } from 'react';

import Badge from '@material-ui/core/Badge';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import Send from '@material-ui/icons/Send';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import Messages from '../components/Messages';
import Videos from '../components/Videos';
import { useEphemeralSwarm } from '../ephemeral-swarm';
import { useChannelMessages } from '../model';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden',
    height: '100%'
  },

  rootNarrow: {
    flexDirection: 'column-reverse'
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
    justifyContent: 'flex-end'
  },

  messages: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column-reverse',
    minWidth: 400
  },

  videos: {
    display: 'flex',
    flexShrink: 0,
    maxWidth: 400,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
    backgroundColor: '#222'
  },

  input: {
    display: 'flex',
    flexShrink: 0,
    margin: theme.spacing(2),
    marginTop: theme.spacing(4)
  }
}));

export const Channel = ({ topic, itemId, narrow, embedded }) => {
  assert(topic);
  assert(itemId);

  const classes = useStyles();
  const [messages, createMessage] = useChannelMessages(topic, itemId);
  const [connections, streams, streamsWithMetaData] = useEphemeralSwarm(itemId);
  const [content, setContent] = useState('');
  const [videoEnabled, setVideoEnabled] = useState(false);

  const handleSubmit = () => {
    const value = content.trim();
    if (value.length) {
      createMessage(value);
      setContent('');
    }
  };

  const handleKeyDown = ({ key }) => {
    switch (key) {
      case 'Enter': {
        handleSubmit();
        break;
      }

      default:
    }
  };

  return (
    <div className={clsx(classes.root, { [classes.rootNarrow]: narrow })}>
      <div className={classes.content}>
        <TableContainer className={classes.messages}>
          <Messages messages={messages} />
        </TableContainer>

        <FormControl className={classes.input}>
          <OutlinedInput
            value={content}
            onChange={event => setContent(event.target.value)}
            onKeyDown={handleKeyDown}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton onClick={handleSubmit}>
                  <Send />
                </IconButton>
                <IconButton onClick={() => setVideoEnabled(current => !current)} disabled={embedded}>
                  {videoEnabled
                    ? <VideocamOffIcon />
                    : <Badge badgeContent={streams.length} color="primary"><VideocamIcon /></Badge>}
                </IconButton>
              </InputAdornment>
            )}
          />
        </FormControl>
      </div>

      {videoEnabled && (
        <div className={classes.videos}>
          <Videos connections={connections} streamsWithMetaData={streamsWithMetaData} />
        </div>
      )}
    </div>
  );
};
