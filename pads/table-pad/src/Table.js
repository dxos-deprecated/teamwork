//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

// TODO(burdon): Standardize CSS across pads.
const useStyles = makeStyles(() => ({
  root: {
  }
}));

export default function Table ({ items, onAdd, onUpdate }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <span>TABLE</span>
      <button onClick={() => onAdd({ text: 'Something' })}>Add</button>
      <p>Items: {JSON.stringify(items.map(item => item.model.getProperty('text')))}</p>
    </div>
  );
}
