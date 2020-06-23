//
// Copyright 2020 DXOS.org
//

import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import { humanize } from '@dxos/crypto';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

export const ShareDialog = ({ party, open, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>DXOS Party sharing</DialogTitle>
      <DialogContent>
        <Typography>{`This party has ${party.members.length} collaborators. Adding a party collaborator will give them access to all views within this party.`}</Typography>
        <DialogTitle variant="h5">Collaborators</DialogTitle>
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {party.members.map((member) => (
                <TableRow key={member.publicKey}>
                  <TableCell>{member.displayName || humanize(member.publicKey)}</TableCell>
                  <TableCell>Collaborator</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};
