//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';

export const useStyles = makeStyles(() => ({
  padContainer: {
    padding: 4,
    borderRadius: 4
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

export const Pad = ({ title, icon, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.padContainer}>
      <div className={classes.padContent}>{children}</div>
      {/* <div className={classes.padInfo}>
        <Icon className={classes.padInfoIcon} />
        <Typography variant="button">{title}</Typography>
      </div> */}
    </div>
  );
};

export default Pad;
