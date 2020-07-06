//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import FaceIcon from '@material-ui/icons/Face';
import { AvatarGroup } from '@material-ui/lab';
import { Add } from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import { humanize } from '@dxos/crypto';

import { getAvatarStyle } from './MemberAvatar';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  }
}));

// TODO(burdon): Pass in array (small UX data object) of processed members (don't apply humanize here).
const PartyMemberList = ({ party, onUserInvite }) => {
  const classes = useStyles();
  const theme = useTheme();

  // TODO(burdon): Make smaller.
  // TODO(burdon): Invite should be rounded "share" button not avatar.

  return (
    <div className={classes.root}>
      <AvatarGroup>
        {party.members.map(member => (
          <Tooltip key={member.publicKey} title={member.displayName || humanize(member.publicKey)} placement="top">
            <Avatar className={classes.avatar} style={getAvatarStyle(theme, member.publicKey)}>
              {member.displayName ? member.displayName.slice(0, 1).toUpperCase() : <FaceIcon />}
            </Avatar>
          </Tooltip>
        ))}

        <Tooltip title="New member" placement="top">
          <Avatar className={classes.avatar} onClick={onUserInvite}>
            <Add />
          </Avatar>
        </Tooltip>
      </AvatarGroup>
    </div>
  );
};

export default PartyMemberList;
