//
// Copyright 2018 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import { Typography, Card as MuiCard, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { PLANNER_LABELS } from '../model/labels';

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    padding: 20
  },
  deleted: {
    backgroundColor: theme.palette.grey[300]
  },
  listDeleted: {
    backgroundColor: theme.palette.grey[200]
  },
  labels: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  label: {
    width: 30,
    height: 20
  }
}));

const InnerCard = (props) => {
  const { cardProperties } = props;
  return <Typography variant="body1">{cardProperties.title}</Typography>;
};

const MiniCard = (props) => {
  const classes = useStyles();
  const { className, style, onOpenCard, cardProperties, listDeleted } = props;
  const deletedClassName = cardProperties.deleted
    ? classes.deleted
    : (listDeleted ? classes.listDeleted : '');

  return (
    <MuiCard className={clsx(classes.root, className, deletedClassName)} onMouseUp={onOpenCard}>
      {cardProperties.labels && (
        <div className={classes.labels}>
          {PLANNER_LABELS
            .filter(x => cardProperties.labels[x])
            .map(label => (
              <Button
                className={classes.label}
                key={label}
                size="small"
                style={{ backgroundColor: label }}
                disabled={true}
              />
            )
          )}
        </div>
      )}
      <InnerCard style={style} classes={classes} cardProperties={cardProperties} />
    </MuiCard>
  );
};

export default MiniCard;
