//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { LinearProgress, makeStyles } from '@material-ui/core';

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
  svg: {
    width: '600px',
    height: '600px',
    opacity: '.03',
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

  return (
    <div className={classes.root}>
      <svg
        className={classes.svg}
        viewBox='0 0 1067 1067'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M533.333,355.556l11.794,-8.578l474.074,651.852l-19.523,20.944l-466.345,-291.466l-466.345,291.466l-19.523,-20.944l474.074,-651.852l11.794,8.578Zm418.085,599.661l-418.085,-574.867l-418.085,574.867l410.356,-256.473l15.458,0l410.356,256.473Z' />
        <path d='M533.333,338.358l466.345,-291.465l19.523,20.944l-474.074,651.852l-11.794,-8.578l-11.794,8.578l-474.074,-651.852l19.523,-20.944l466.345,291.465Zm-418.085,-226.908l418.085,574.867l418.085,-574.867l-410.356,256.472l-15.458,0l-410.356,-256.472Z' />
        <path d='M518.776,355.556l0,355.555l29.167,0l0,-355.555l-29.167,0Z' />
      </svg>

      <LinearProgress
        classes={{ root: classes.progress }}
        variant='determinate'
        value={value}
      />
    </div>
  );
};

export default InitializeLoader;
