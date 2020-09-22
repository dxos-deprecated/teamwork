//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import MessengerPad from '@dxos/messenger-pad';
import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useItems, TYPE_EDITOR_DOCUMENT } from './model';

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1
  }
}));

const EditorPad = ({ party, topic, itemId }) => {
  assert(topic);
  assert(itemId);

  const classes = useStyles();
  const [pads] = usePads();
  const { items, createItem } = useItems(topic, pads.map((pad) => pad.type));
  const [messengerOpen, setMessengerOpen] = useState(false);

  const handleCreateItem = (type) => {
    return createItem(type);
  };

  const item = items.find(item => item.itemId === itemId);

  if (!item) {
    return null;
  }

  return (
    <Grid container justify="center" className={classes.root}>
      <Grid item>
        <Editor
          topic={topic}
          itemId={itemId}
          title={item.displayName}
          pads={pads.filter(pad => pad.type !== TYPE_EDITOR_DOCUMENT)}
          items={items.filter(item => item.type !== TYPE_EDITOR_DOCUMENT)}
          onCreateItem={handleCreateItem}
          onToggleMessenger={() => setMessengerOpen(oldValue => !oldValue)}
          />
      </Grid>
      <Grid item>
        {messengerOpen && (
          <MessengerPad.main
            embedded
            party={party}
            topic={topic}
            itemId={itemId}
            />
        )}
      </Grid>
    </Grid>
  );
};

export default EditorPad;
