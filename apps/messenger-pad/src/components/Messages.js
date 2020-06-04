//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import moment from 'moment';
import ColorHash from 'color-hash';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const colorHash = new ColorHash({ saturation: 1 });

const useStyles = makeStyles(() => ({
  timestamp: {
    width: 100
  },

  sender: {
    marginRight: 8
  }
}));

const Messages = ({ messages }) => {
  const classes = useStyles();
  if (!messages) {
    return null;
  }

  // TODO(burdon): Remove lines (like slack).
  // TODO(burdon): Add date if not today.

  return (
    <Table size="small">
      <TableBody>
        {messages.map(({ id, timestamp, sender, text, }) => (
          <TableRow key={id}>
            <TableCell className={classes.timestamp}>
              <Typography
                component="span"
                variant="caption"
              >
                {moment(timestamp).format('LT')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                component="span"
                variant="body1"
                className={classes.sender}
                style={{ color: colorHash.hex(sender) }}
              >
                {sender}
              </Typography>
              <Typography
                component="span"
                variant="body1"
              >
                {text}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Messages;
