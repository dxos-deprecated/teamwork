//
// Copyright 2018 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import { Typography, Card as MuiCard, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import SettingsIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    padding: 20
  },
  deleted: {
    backgroundColor: theme.palette.grey[300]
  }
}));

const InnerCard = (props) => {
  const { cardProperties } = props;
  return <Typography variant="body1">{cardProperties.title}</Typography>;
};

const MiniCard = (props) => {
  const classes = useStyles();
  const { className, style, onOpenCard, cardProperties } = props;

  return (
    <MuiCard className={clsx(classes.root, className, cardProperties.deleted ? classes.deleted : '')} onMouseUp={onOpenCard}>
      <InnerCard style={style} classes={classes} cardProperties={cardProperties} />
    </MuiCard>
  );
};

export default MiniCard;
