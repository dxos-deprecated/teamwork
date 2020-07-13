//
// Copyright 2020 DXOS.org
//

import React from 'react';
import assert from 'assert';

import { makeStyles } from '@material-ui/styles';
import grey from '@material-ui/core/colors/blueGrey';

import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useViews } from './model';

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
  const { views, createView } = useViews(topic, pads.map((pad) => pad.type));

  const handleCreateItem = () => {
    return createView();
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Editor
          topic={topic}
          itemId={viewId}
          pads={pads}
          items={views.filter(view => view.viewId.toString() !== viewId.toString())} // do not allow inception embedding
          onCreateItem={handleCreateItem}
        />
      </div>
    </div>
  );
};

export default EditorPad;
