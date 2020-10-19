//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { Grid, CardContent, Card, Button } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '1.5em',
    color: 'red',
    marginBottom: 20
  },

  code: {
    display: 'block',
    font: 'monospace',
    padding: 8,
    border: '1px solid #ccc',
    backgroundColor: '#eee',
    borderRadius: 8,
    margin: 8
  },

  actions: {
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: 20
  }
}));

export const ErrorView = ({ config, error, storage }) => {
  const classes = useStyles();
  const isDev = process.env.NODE_ENV === 'development';

  const handleRetry = () => {
    window.location.reload();
  };

  const handleReset = async () => {
    await storage.destroy();
    handleRetry();
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Card style={{ width: '50%' }}>
        <CardContent>
          <p className={classes.title}>Something went wrong.</p>
          <p>Please try again, or <a target="_blank" rel="noreferrer" href="https://github.com/dxos/teamwork/issues/new">Report this issue</a>.</p>
          <p>Details:</p>
          <code className={classes.code}>{String(error?.stack)}</code>
          {isDev && <>
            <p>Configuration:</p>
            <code className={classes.code}>{JSON.stringify(config.values, undefined, 2)}</code>
          </>}
        </CardContent>
        <CardActions className={classes.actions}>
          {isDev
            ? <Button variant='outlined' color='secondary' onClick={handleReset}>Reset Storage</Button>
            : <span />
          }
          <Button variant='outlined' color='primary' onClick={handleRetry}>Try again</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
