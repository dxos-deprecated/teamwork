//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { LinearProgress, makeStyles } from '@material-ui/core';

import { DXOSIcon } from '../icons/index';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 600,
    height: 600,
    opacity: 0.03,
    transform: 'rotate(0deg)',
    animation: 'preloader 2s infinite',
    animationDelay: '0s',
    animationTimingFunction: 'ease-in-out'
  },
  progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4
  }
}));

const InitializeLoader = ({ value }: { value: number }) => {
  const classes = useStyles();

  // TODO(burdon): Factor out and re-use in static HTML?
  return (
    <div className={classes.root}>
      <DXOSIcon className={classes.logo} />

      <LinearProgress
        classes={{ root: classes.progress }}
        variant='determinate'
        value={value}
      />
    </div>
  );
};

export default InitializeLoader;
