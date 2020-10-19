//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
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

import { ArchiveButton, RestoreButton } from '.';
import { useLabels } from '../hooks';
import { toggleLabel } from '../model/labels';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 400
  },
  title: {
    marginLeft: theme.spacing(2)
  },
  labelSection: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column'
  },
  labelButton: {
    marginTop: theme.spacing(1),
    width: 150
  },
  label: {
    marginTop: theme.spacing(1),
    width: 160
  }
}));

export const CardDetailsDialog = ({ open, onClose, onToggleArchive, card, onCardUpdate }) => {
  const classes = useStyles();
  const { names, labels, colorLookup } = useLabels();

  if (!card) return null;

  const handleToggleLabel = async (toggledLabel) => {
    await onCardUpdate('labels', toggleLabel(card.model.getProperty('labels'), toggledLabel));
  };

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
          value={card.model.getProperty('title')}
          onUpdate={(title) => onCardUpdate('title', title)}
        />
        <div className={classes.labelSection}>
          <Typography variant='body1'>Labels:</Typography>
          {labels.map(label => (
            <Chip
              className={classes.label}
              key={label}
              label={names[label]}
              style={{ backgroundColor: colorLookup[label] }}
              onClick={() => handleToggleLabel(label)}
              avatar={card.model.getProperty('labels') && (card.model.getProperty('labels')[label] ? <CheckIcon /> : <span style={{ width: '18px' }} />)}
              size="small"
            />
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        {!card.model.getProperty('deleted') ? (
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
