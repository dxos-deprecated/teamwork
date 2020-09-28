//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import markdown from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { Grid, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { docToMarkdown } from '@dxos/editor-core';
import MessengerPad from '@dxos/messenger-pad';
import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useItems, TYPE_EDITOR_DOCUMENT } from './model';

SyntaxHighlighter.registerLanguage('markdown', markdown);

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    height: 'fill-available',
    alignItems: 'center',
    overflow: 'overlay',
    flexWrap: 'nowrap',
    justifyContent: 'center',

    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      justifyContent: 'flex-start',

      '& > div': {
        minHeight: 600,
        width: '100%'
      }
    }
  },

  editor: {
    height: 'inherit'
  },

  markdownView: {
    overflowY: 'auto',
    alignSelf: 'stretch'
  },

  messenger: {
    [theme.breakpoints.down('md')]: {
      minHeight: 'auto'
    }
  }
}));

const EditorPad = ({ party, topic, itemId }) => {
  assert(topic);
  assert(itemId);

  const classes = useStyles();
  const theme = useTheme();

  const [pads] = usePads();
  const { items, createItem } = useItems(topic, pads.map((pad) => pad.type));

  const [markdownContent, setMarkdownContent] = useState('');
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [markdownViewOpen, setMarkdownViewOpen] = useState(false);

  function handleCreateItem (type) {
    return createItem(type);
  }

  const handleEditorCreated = function (editor) {
    const { doc } = editor.sync;

    doc.on('update', () => {
      setMarkdownContent(docToMarkdown(doc));
    });

    setMarkdownContent(docToMarkdown(doc));
  };

  function handleToggleMarkdownView () {
    setMarkdownViewOpen(isOpen => {
      !isOpen && setMessengerOpen(false);
      return !isOpen;
    });
  }

  function handleToggleMessenger () {
    setMessengerOpen(isOpen => {
      !isOpen && setMarkdownViewOpen(false);
      return !isOpen;
    });
  }

  const item = items.find(item => item.itemId === itemId);

  if (!item) {
    return null;
  }

  return (
    <Grid container className={classes.root} alignItems="stretch">
      <Grid item xs={12} lg={6} xl={6} className={classes.editor}>
        <Editor
          topic={topic}
          itemId={itemId}
          title={item.displayName}
          pads={pads.filter(pad => pad.type !== TYPE_EDITOR_DOCUMENT)}
          items={items.filter(item => item.type !== TYPE_EDITOR_DOCUMENT)}
          onCreateItem={handleCreateItem}
          onEditorCreated={handleEditorCreated}
          onToggleMessenger={handleToggleMessenger}
          onToggleMarkdownView={handleToggleMarkdownView}
        />
      </Grid>

      {markdownViewOpen && (
        <Grid item xs={12} xl={6} className={classes.markdownView}>
          <SyntaxHighlighter
            language="markdown"
            style={github}
            customStyle={{
              fontSize: 'large',
              margin: theme.spacing(1),
              whiteSpace: 'break-spaces',
              wordBreak: 'break-all',
              overflowX: 'hidden',
              border: `1px solid ${theme.palette.primary.main}`,
              height: `calc(100% - ${theme.spacing(2)}px)`
            }}
          >
            {markdownContent}
          </SyntaxHighlighter>
        </Grid>
      )}

      {messengerOpen && (
        <Grid item xs={12} xl={6} className={classes.messenger}>
          <MessengerPad.main
            embedded
            party={party}
            topic={topic}
            itemId={itemId}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default EditorPad;
