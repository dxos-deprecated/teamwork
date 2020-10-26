//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

// TODO(burdon): Standardize CSS across pads.
const useStyles = makeStyles((theme) => ({
  root: {
  }
}));

export default function Table ({ title, items, onAdd, onUpdate }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <span>TABLE</span>
    </div>
  );
}
