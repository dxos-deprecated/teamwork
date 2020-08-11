//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';

import MessengerPad from '@dxos/messenger-pad';
import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useViews, TYPE_EDITOR_DOCUMENT } from './model';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },

  container: {
    display: 'flex',
    flex: 1,
    [theme.breakpoints.up('subMbp')]: {
      margin: 'auto'
    },
    maxWidth: 800
  },

  messengerContainer: {
    width: 400
  }
}));

const EditorPad = ({ party, topic, viewId }) => {
  assert(topic);
  assert(viewId);

  const classes = useStyles();
  const [pads] = usePads();
  const { views, createView } = useViews(topic, pads.map((pad) => pad.type));
  const [messengerOpen, setMessengerOpen] = useState(false);

  const handleCreateItem = (type) => {
    return createView(type);
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Editor
          topic={topic}
          itemId={viewId}
          pads={pads.filter(pad => pad.type !== TYPE_EDITOR_DOCUMENT)}
          items={views.filter(view => view.type !== TYPE_EDITOR_DOCUMENT)}
          onCreateItem={handleCreateItem}
          onToggleMessenger={() => setMessengerOpen(oldValue => !oldValue)}
        />
        {messengerOpen && (
          <div className={classes.messengerContainer}>
            <MessengerPad.main
              embedded
              party={party}
              topic={topic}
              viewId={viewId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPad;
