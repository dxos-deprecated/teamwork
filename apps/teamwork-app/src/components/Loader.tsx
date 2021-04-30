//
// Copyright 2020 DXOS.org
//

import { CircularProgress, Grid } from '@material-ui/core';
import React from 'react';

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
  )
}
