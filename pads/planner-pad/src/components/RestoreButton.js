//
// Copyright 2020 DXOS.org
//

//
// Copyright 2020 DXOS.org
//

import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

export const RestoreButton = withStyles(() => ({
  root: {
    color: green[400]
  }
}))(Button);

export default RestoreButton;
