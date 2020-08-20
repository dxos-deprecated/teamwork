//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AssignmentIcon from '@material-ui/icons/AssignmentTurnedIn';
import CheckIcon from '@material-ui/icons/Check';

import { EditableText } from '@dxos/react-ux';

import { ArchiveButton, RestoreButton } from '../components';
import { PLANNER_LABELS, toggleLabel } from '../model/labels';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 400
  },
  title: {
    marginLeft: theme.spacing(2)
  },
  margin: {
    marginBottom: theme.spacing(2)
  },
  labelSection: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  labelsTitle: {
    // color: theme.palette.grey[300]
  },
  labelButton: {
    marginTop: theme.spacing(1),
    width: 150
  }
}));

const CardDetailsDialog = ({ open, onClose, onToggleArchive, card, onCardUpdate }) => {
  const classes = useStyles();

  if (!card) return null;

  const handleToggleLabel = (toggledLabel) => {
    onCardUpdate({ labels: toggleLabel(card.properties.labels, toggledLabel) });
  };

  console.warn(card.properties)

  return (
    <Dialog classes={{ paper: classes.root }} open={open} maxWidth='md' onClose={onClose}>
      <DialogTitle>
      <Toolbar variant='dense' disableGutters>
          <AssignmentIcon />
          <Typography variant='h5' className={classes.title}>Card</Typography>
        </Toolbar>
      </DialogTitle>

      <DialogContent>
        <EditableText
          label='Title'
          value={card.properties && card.properties.title}
          onUpdate={(title) => onCardUpdate({ title })}
        />
        <div className={classes.labelSection}>
          <Typography className={classes.labelsTitle} variant='body2'>Labels:</Typography>
          {PLANNER_LABELS.map(label => (
            <Button
              className={classes.labelButton}
              key={label}
              style={{ backgroundColor: label }}
              onClick={() => handleToggleLabel(label)}
              startIcon={card.properties.labels && card.properties.labels[label] && <CheckIcon />}
              size="small"
            >
                {label}
            </Button>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        {!card.properties.deleted ? (
          <ArchiveButton onClick={onToggleArchive}>Archive</ArchiveButton>
        ) : (
          <RestoreButton onClick={onToggleArchive}>Restore</RestoreButton>
        )}
        <Button onClick={onClose} color='primary'>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardDetailsDialog;
