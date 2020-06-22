//
// Copyright 2020 DXOS.org
//

import React from 'react';
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

export const PartyMembers = ({ party }) => {
  const classes = useStyles();

  return (
    <div className={classes.memberList}><MemberList party={party} /></div>
  );
};
