//
// Copyright 2018 Wireline, Inc.
//

import clsx from 'clsx';
import React from 'react';

import { Typography, Card as MuiCard } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CardProperties } from '../model/CardProperties';

const useStyles = makeStyles(() => ({
  root: {
    cursor: 'pointer',
    padding: 20
  }
}));

interface InnerCardProps {
  card: CardProperties,
  style?: string,
  classes?: ReturnType<typeof useStyles>,
}

const InnerCard = (props: InnerCardProps) => {
  const { card } = props;
  return <Typography variant="body1">{card.title}</Typography>;
};

export interface MiniCardProps {
  className?: string,
  style?: string,
  onOpenCard: () => void,
  card: CardProperties,
}

const MiniCard = (props: MiniCardProps) => {
  const classes = useStyles();
  const { className, style, onOpenCard, card } = props;

  return (
    <MuiCard className={clsx(classes.root, className)} onMouseUp={onOpenCard}>
      <InnerCard style={style} classes={classes} card={card} />
    </MuiCard>
  );
};

export default MiniCard;
