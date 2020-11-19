//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  padContainer: {
    padding: 4,
    borderRadius: 4,
    maxHeight: '400px',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: props => props.reverseScroll ? 'column-reverse' : 'column'
  },
  padContent: {
    backgroundColor: 'inherit'
  },
  padInfo: {
    display: 'flex',
    paddingTop: 4
  },
  padInfoIcon: {
    marginRight: 4
  }
}));

export const Pad = ({ reverseScroll, children }) => {
  const classes = useStyles({ reverseScroll });
  return (
    <div className={classes.padContainer}>
      <div className={classes.padContent}>{children}</div>
    </div>
  );
};

export default Pad;
