import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import grey from '@material-ui/core/colors/grey';

export const useStyles = makeStyles(() => ({
  padContainer: {
    backgroundColor: grey[300],
    padding: 4,
    borderRadius: 4
  },
  padInfo: {
    display: 'flex',
    paddingTop: 4
  },
  padInfoIcon: {
    marginRight: 4
  }
}));

const Pad = ({ title, icon: Icon, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.padContainer}>
      {children}
      <div className={classes.padInfo}>
        <Icon className={classes.padInfoIcon} />
        <Typography variant="button">{title}</Typography>
      </div>
    </div>
  );
};

export default Pad;
