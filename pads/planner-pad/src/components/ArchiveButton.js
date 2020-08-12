//
// Copyright 2020 DXOS.org
//

import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

export const ArchiveButton = withStyles(() => ({
  root: {
    color: red[400]
  }
}))(Button);

export default ArchiveButton;
