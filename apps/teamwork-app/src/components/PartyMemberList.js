//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import FaceIcon from '@material-ui/icons/Face';
import { AvatarGroup } from '@material-ui/lab';
import { Add } from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import { humanize } from '@dxos/crypto';

const useStyles = makeStyles({
  root: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15
  }
});

export const PartyMemberList = ({ party, handleUserInvite }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AvatarGroup>
        {party.members.map(member => (<>
          <Tooltip key={member.publicKey} title={member.displayName || humanize(member.publicKey)} placement="top">
            <Avatar>
              <FaceIcon />
            </Avatar>
          </Tooltip>
        </>))}
        <Tooltip title="New member" placement="top">
          <Avatar onClick={handleUserInvite}>
            <Add />
          </Avatar>
        </Tooltip>
      </AvatarGroup>
    </div>
  );
};
