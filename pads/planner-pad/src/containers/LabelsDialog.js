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

import { EditableText } from '@dxos/react-ux';

import { useLabels } from '../hooks';
import { PLANNER_LABELS, labelColorLookup } from '../model/labels';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 400
  },
  title: {
    marginLeft: theme.spacing(2)
  },
  labelSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginTop: theme.spacing(2),
    borderRadius: 6,
    paddingLeft: 5,
    paddingRight: 5
  }
}));

const LabelsDialog = ({ open, onClose, onUpdate }) => {
  const classes = useStyles();
  const { names } = useLabels();

  return (
    <Dialog classes={{ paper: classes.root }} open={open} maxWidth='md' onClose={onClose}>
      <DialogTitle>
        <Toolbar variant='dense' disableGutters>
          <AssignmentIcon />
          <Typography variant='h5' className={classes.title}>Labels</Typography>
        </Toolbar>
      </DialogTitle>

      <DialogContent>
        <div className={classes.labelSection}>
          {PLANNER_LABELS.map(label => (
            <EditableText
              className={classes.label}
              key={label}
              value={names[label]}
              onUpdate={(value) => onUpdate({ ...names, [label]: value })}
              style={{ backgroundColor: labelColorLookup[label] }}
            />
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabelsDialog;
