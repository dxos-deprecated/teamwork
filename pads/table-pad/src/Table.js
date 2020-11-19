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

export default function Table () {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <span>TABLE</span>
    </div>
  );
}
