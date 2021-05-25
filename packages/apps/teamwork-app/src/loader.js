//
// Copyright 2020 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import { makeStyles } from '@material-ui/core';

import { DXOSIcon } from '@dxos/react-appkit';

const useStyles = makeStyles(() => ({
  '@global': {
    body: {
      margin: 0
    }
  },

  container: {
    position: 'relative',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  logo: {
    width: 400,
    height: 400,
    // opacity: 0.05,
    transform: 'rotate(0deg)',
    animation: '$loader 2s infinite',
    animationDelay: 0,
    animationTimingFunction: 'ease-in-out',
  },

  '@keyframes loader': {
    '40%': {
      transform: 'scale(1)'
    },
    '50%': {
      transform: 'scale(1.1)'
    },
    '60%': {
      transform: 'scale(1)'
    }
  }
}));

const Loader = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <DXOSIcon className={classes.logo} />
    </div>
  );
};

const init = () => {
  console.log('loader');
  ReactDOM.render(<Loader />, document.getElementById('loader'));
};

init();
