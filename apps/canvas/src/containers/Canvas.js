//
// Copyright 2020 DxOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Canvas = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} />
  );
};

export default Canvas;
