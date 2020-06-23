//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import Button from '@material-ui/core/Button';

import { humanize } from '@dxos/crypto';
import { MemberList } from '@dxos/react-appkit';

const useStyles = makeStyles({
  chipList: {
    flex: 1
  },
  chip: {
    marginLeft: 15,
    marginRight: 5
  }
});

export const PartyMembersPills = ({ party }) => {
  const classes = useStyles();

  return (
    <div className={classes.chipList}>
      {party.members.map(member => (<>
        <Chip
          className={classes.chip}
          size="small"
          icon={<FaceIcon />}
          label={member.displayName || humanize(member.publicKey)}
        />
        <Chip
          className={classes.chip}
          size="small"
          icon={<FaceIcon />}
          label={member.displayName || humanize(member.publicKey)}
        />
        <Chip
          className={classes.chip}
          size="small"
          icon={<FaceIcon />}
          label={member.displayName || humanize(member.publicKey)}
        />
        <Chip
          className={classes.chip}
          size="small"
          icon={<FaceIcon />}
          label={member.displayName || humanize(member.publicKey)}
        />
        <Chip
          className={classes.chip}
          size="small"
          icon={<FaceIcon />}
          label={member.displayName || humanize(member.publicKey)}
        />
        <Chip
          className={classes.chip}
          size="small"
          icon={<FaceIcon />}
          label={member.displayName || humanize(member.publicKey)}
        />
        <Button size="small" color="primary" onClick={undefined}>New member</Button>
      </>))}
    </div>
  )
};
