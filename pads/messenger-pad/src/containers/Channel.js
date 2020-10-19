//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import Send from '@material-ui/icons/Send';
import Badge from '@material-ui/core/Badge';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import { keyToBuffer } from '@dxos/crypto';
import { Editor } from '@dxos/editor';
import { useParty } from '@dxos/react-client';

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

  floatingButtons: {
    alignSelf: 'flex-end',
    marginTop: -theme.spacing(9),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    textAlign: 'right',

    '& > button': {
      marginTop: 1,
      padding: theme.spacing(2)
    }
  }
}));

const useEditorStyles = makeStyles(theme => {
  return {
    root: {
      flex: '0 0 auto',
      margin: theme.spacing(2),
      marginTop: theme.spacing(3.5)
    },

    editorContainer: {
      padding: '18.5px 14px',
      paddingRight: theme.spacing(12),
      height: theme.spacing(7),
      maxHeight: 'initial',
      border: '1px solid black',
      borderRadius: theme.spacing(0.5),
      borderColor: 'rgb(195, 195, 195)',
      overflow: 'hidden'
    },

    editor: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.1876em',
      letterSpacing: '0.00938em',
      '& p': {
        marginTop: 0,
        marginBottom: 0
      }
    }
  };
});

export const Channel = ({ topic, itemId, narrow, embedded }) => {
  assert(topic);
  assert(itemId);

  const classes = useStyles();

  const [messages, createMessage] = useChannelMessages(topic, itemId);
  const [connections, streams, streamsWithMetaData] = useEphemeralSwarm(itemId);
  const editorClasses = useEditorStyles();

  const [videoEnabled, setVideoEnabled] = useState(false);
  const editor = useRef();

  function handleEditorCreated (editorInstance) {
    editor.current = editorInstance;
  }

  function handleSubmit () {
    if (!editor || !editor.current) return;
    const value = editor
      .current
      .getContentHtml()
      .replace(/<\/?p>/g, '')
      .replace(/<br\/?>/g, '')
      .trim();

    if (value.length) {
      createMessage(value);
      editor.current.clear();
    }
  }

  function handleKeyDown (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className={clsx(classes.root, { [classes.rootNarrow]: narrow })}>
      <div className={classes.content}>
        <TableContainer className={classes.messages}>
          <Messages messages={messages} />
        </TableContainer>

        <Editor
          onCreated={handleEditorCreated}
          onKeyDown={handleKeyDown}
          classes={editorClasses}
        />

        <div className={classes.floatingButtons}>
          <IconButton onClick={handleSubmit}>
            <Send />
          </IconButton>
          <IconButton onClick={() => setVideoEnabled(current => !current)} disabled={embedded} edge="start">
            {videoEnabled
              ? <VideocamOffIcon />
              : <Badge badgeContent={streams.length} color="primary"><VideocamIcon /></Badge>}
          </IconButton>
        </div>
      </div>

      {videoEnabled && (
        <div className={classes.videos}>
          <Videos connections={connections} streamsWithMetaData={streamsWithMetaData} />
        </div>
      )}
    </div>
  );
};
