//
// Copyright 2020 DxOS.org
//

import React  from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';

// https://material-ui.com/customization/theming
const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true
    },
  },

  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          overflow: 'hidden', // Prevent scroll bounce.
          backgroundColor: grey[50]
        }
      }
    }
  },

  palette: {
    primary: blue
  }
});

const Theme = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);

export default Theme;
