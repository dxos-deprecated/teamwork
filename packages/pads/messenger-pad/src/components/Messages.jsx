//
// Copyright 2020 DXOS.org
//

import ColorHash from 'color-hash';
import moment from 'moment';
import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

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

  const handleMessageClick = event => {
    if (event.target.nodeName === 'A') {
      event.preventDefault();
      const currentUrl = location.href.split('/').slice(0, -1).join('/');
      window.location.assign(`${currentUrl}/${event.target.href.split('/').pop()}`);
    }
  };

  return (
    <Table size="small">
      <TableBody>
        {messages.map(({ timestamp, sender, text }) => (
          <TableRow key={`${timestamp}${text}`}>
            <TableCell className={classes.timestamp}>
              <Typography
                component="span"
                variant="caption"
              >
                {moment(parseInt(timestamp)).format('LT')}
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
                <span
                  onClick={handleMessageClick}
                  dangerouslySetInnerHTML={{ __html: text }}
                />

              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Messages;
