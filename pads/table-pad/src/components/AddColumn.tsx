//
// Copyright 2018 DXOS.org
//

import React, { useState } from 'react';

import { Button, Card, Dialog, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/icons/ViewColumn';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 300
  },
  typeContainer: {
    marginTop: theme.spacing(2)
  },
  textField: {
    width: '100%'
  },
  buttonContainer: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'space-between'
  },
  card: {
    padding: 20
  }
}));

export interface AddColumnProps {
  onAddColumn?: (title: string, type: string) => void,
  open: boolean,
  onClose?: () => void,
}

export const AddColumn = ({ onAddColumn, open, onClose }: AddColumnProps) => {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('text');

  const titleIsEmpty = title.trim().length === 0;

  const handleCancel = () => {
    onClose?.();
    setTitle('');
    setType('text');
  };

  const handleAdd = () => {
    onAddColumn?.(title, type);
    handleCancel();
  };

  const handleKeyDown = (ev: any) => {
    if (ev.key === 'Enter') {
      handleAdd();
    } else if (ev.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>
        <Toolbar variant='dense' disableGutters>
          <Icon/>
          &nbsp;
          <Typography variant='subtitle1'>Add new column</Typography>
        </Toolbar>
      </DialogTitle>
      <div className={classes.root}>
        <Card className={classes.card}>
          <TextField
            label="Column Title"
            className={classes.textField}
            onKeyDown={handleKeyDown}
            value={title}
            autoFocus
            onChange={ev => setTitle(ev.target.value)}
          />
          <div className={classes.typeContainer}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Column type</FormLabel>
              <RadioGroup value={type} onChange={e => setType(e.target.value)}>
                <FormControlLabel value="text" control={<Radio />} label="Text" />
                <FormControlLabel value="checkbox" control={<Radio />} label="Checkbox" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              size="small"
              color="primary"
              variant="text"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="small"
              color="primary"
              disabled={titleIsEmpty}
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add
            </Button>
          </div>
        </Card>
      </div>
    </Dialog>
  );
};

export default AddColumn;
