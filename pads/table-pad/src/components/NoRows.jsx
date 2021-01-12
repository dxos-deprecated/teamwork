//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  initializeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  initializeButton: {
    height: 'fit-content'
  }
}));

const NoRows = ({ onInitialize }) => {
  const classes = useStyles();

  return (
    <div className={classes.initializeContainer}>
      <p>It is empty here. Create your first row, or:&nbsp;</p>
      <button className={classes.initializeButton} onClick={onInitialize}>Initialize</button>
    </div>
  );
};

export default NoRows;
