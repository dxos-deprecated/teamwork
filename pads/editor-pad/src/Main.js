//
// Copyright 2020 DXOS.org
//

import React from 'react';
import assert from 'assert';
import { Chance } from 'chance';

import { makeStyles } from '@material-ui/styles';
import grey from '@material-ui/core/colors/blueGrey';

import { usePads } from '@dxos/react-appkit';

import { Editor } from './components/Editor';
import { useItems } from './model';

const chance = new Chance();

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
  const viewModel = useItems(topic, pads.map((pad) => pad.type));

  // TODO(burdon): Factor out generators (incl. chance).
  const handleCreateItem = (type) => {
    const displayName = `embeded-item-${chance.word()}`;
    const viewId = viewModel.createView(type, displayName);
    return { __type_url: type, viewId, displayName };
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Editor
          topic={topic}
          itemId={viewId}
          pads={pads}
          items={viewModel.getAllViews()}
          onCreateItem={handleCreateItem}
        />
      </div>
    </div>
  );
};

export default EditorPad;
