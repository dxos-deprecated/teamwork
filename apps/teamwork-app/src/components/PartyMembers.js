//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import { MemberList } from '@dxos/react-appkit';

const useStyles = makeStyles({
  memberList: {
    flex: 1
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 300,
    width: 250
  }
});

export const PartyMembers = ({ party, handleUserInvite }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <div className={classes.memberList}><MemberList party={party} /></div>
      <CardActions>
        <Button size="small" color="primary" onClick={handleUserInvite}>Invite member</Button>
      </CardActions>
    </Card>
  );
};
