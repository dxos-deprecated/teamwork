//
// Copyright 2020 DXOS.org
//

// File initially copied from the Tutorial's Tasks app

import React, { useState } from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 760,
    margin: '0 auto',
    overflowY: 'auto',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  deleteButton: {
    color: theme.palette.grey[300]
  }
}));

export default function Tasks ({ title, items, onAdd, onUpdate }) {
  const classes = useStyles();
  const [newTask, setNewTask] = useState('');

  const handleNewTaskChange = (event) => setNewTask(event.target.value);

  const handleAdd = async () => {
    await onAdd({ text: newTask });
    setNewTask('');
  };

  const handleToggleComplete = item => async (event) => {
    await onUpdate(item, { completed: event.target.checked });
  };

  const handleDelete = item => async () => {
    await onUpdate(item, { deleted: true });
  };

  const handleKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      handleAdd();
    } else if (ev.key === 'Escape') {
      setNewTask('');
    }
  };

  const tasks = items.filter(item => !item.model.getProperty('deleted'));
  tasks.reverse(); // newest tasks first

  return (
    <List className={classes.root}>
      <Typography align="center" variant="h4">{title}</Typography>
      <ListItem>
        <ListItemText>
          <TextField
            value={newTask}
            onChange={handleNewTaskChange}
            margin="normal"
            required
            fullWidth
            autoComplete="false"
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </ListItemText>
        <ListItemIcon>
          <IconButton disabled={!newTask} onClick={handleAdd}>
            <AddIcon />
          </IconButton>
        </ListItemIcon>
      </ListItem>
      {tasks.map((item) => {
        const text = item.model.getProperty('text');
        const completed = item.model.getProperty('completed');
        const labelId = `checkbox-list-secondary-label-${item.id}`;
        return (
          <ListItem key={item.id} button>
            <ListItemText id={labelId} primary={text} />
            <ListItemSecondaryAction>
              <IconButton onClick={handleDelete(item)}>
                <DeleteIcon className={classes.deleteButton} />
              </IconButton>
              <Checkbox
                edge="end"
                onChange={handleToggleComplete(item)}
                checked={completed || false}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
