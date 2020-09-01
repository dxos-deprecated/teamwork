//
// Copyright 2018 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import { Typography, Card as MuiCard, Chip, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useLabels } from '../hooks';
import { PLANNER_LABELS, labelColorLookup } from '../model/labels';

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
    justifyContent: 'start'
  },
  label: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const InnerCard = ({ cardProperties }) => {
  return <Typography variant="body1">{cardProperties.title}</Typography>;
};

export const MiniCard = ({
  className,
  style,
  onOpenCard,
  cardProperties,
  listDeleted
}) => {
  const classes = useStyles();
  const { names } = useLabels();
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
              <Tooltip key={label} title={names[label]}>
                <Chip
                  label='&nbsp;&nbsp;'
                  size="small"
                  style={{ backgroundColor: labelColorLookup[label] }}
                  disabled={false}
                  className={classes.label}
                />
              </Tooltip>
            )
          )}
        </div>
      )}
      <InnerCard style={style} classes={classes} cardProperties={cardProperties} />
    </MuiCard>
  );
};

export default MiniCard;
