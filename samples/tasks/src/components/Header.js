//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  expand: {
    flexGrow: 1
  }
}));

const Header = ({ children, onHome = () => {}, onAdd }) => {
  const classes = useStyles();

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar variant="dense" disableGutters>
        <IconButton aria-label="home" color="inherit" onClick={onHome}>
          <HomeIcon />
        </IconButton>

        <Typography variant="h6" color="inherit" className={classes.expand}>{children}</Typography>

        <IconButton aria-label="create" color="inherit" onClick={onAdd}>
          <AddIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
