//
// Copyright 2020 DXOS.org
//

import React from 'react';
import assert from 'assert';

import { makeStyles } from '@material-ui/styles';
import grey from '@material-ui/core/colors/blueGrey';

import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useItems } from './model';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: grey[200]
  },

  container: {
    display: 'flex',
    flex: 1,
    width: 800,
    maxWidth: 1000,
    margin: 'auto'
  }
});

const EditorPad = ({ topic, viewId }) => {
  assert(topic);
  assert(viewId);

  const classes = useStyles();
  const [pads] = usePads();
  const { items, createItem } = useItems(topic, pads.map((pad) => pad.type));

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Editor
          topic={topic}
          itemId={viewId}
          pads={pads}
          items={items}
          onCreateItem={createItem}
        />
      </div>
    </div>
  );
};

export default EditorPad;
