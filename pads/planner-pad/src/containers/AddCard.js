//
// Copyright 2018 DXOS.org
//

import React, { useState } from 'react';

import { Button, Card, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 10
  },
  openButton: {
    width: '100%',
    justifyContent: 'flex-start',
    textTransform: 'none',
    color: 'grey'
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

const AddCard = (props) => {
  const classes = useStyles();
  const { onAddCard } = props;
  const [title, setTitle] = useState('');
  const [isOpen, setOpen] = useState(false);

  const titleIsEmpty = title.trim().length === 0;

  const handleBlur = () => {
    if (titleIsEmpty) {
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setOpen(false);
  };

  const handleAdd = () => {
    onAddCard(title);
    setOpen(false);
    setTitle('');
  };

  const handleKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      handleAdd();
    } else if (ev.key === 'Escape') {
      handleCancel();
    }
  };

  const AddButton = () => (
    <Button
      size="small"
      variant="text"
      className={classes.openButton}
      startIcon={<AddIcon />}
      onClick={() => setOpen(true)}
    >
      Add another card
    </Button>
  );

  const Form = () => (
    <Card className={classes.card}>
      <TextField
        label="Card Title"
        className={classes.textField}
        onKeyDown={handleKeyDown}
        value={title}
        autoFocus
        onBlur={handleBlur}
        onChange={ev => setTitle(ev.target.value)}
      />
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
  );

  return (
    <div className={classes.root}>
      {isOpen ? <Form /> : <AddButton />}
    </div>
  );
};

export default AddCard;
