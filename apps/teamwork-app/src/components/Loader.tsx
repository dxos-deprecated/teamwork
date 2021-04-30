//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { CircularProgress, Grid } from '@material-ui/core';

export const Loader = () => {
  return (
    <Grid
      container
      alignItems='center'
      justify='center'
      style={{ minHeight: '100vh' }}
    >
      <CircularProgress />
    </Grid>
  );
};
