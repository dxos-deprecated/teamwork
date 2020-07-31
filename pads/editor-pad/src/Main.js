//
// Copyright 2020 DXOS.org
//

import React from 'react';
import assert from 'assert';

import { makeStyles } from '@material-ui/styles';

import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useViews, TYPE_EDITOR_DOCUMENT } from './model';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
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
        />
      </div>
    </div>
  );
};

export default EditorPad;
