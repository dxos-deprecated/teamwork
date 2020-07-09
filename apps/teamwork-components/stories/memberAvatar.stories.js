//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { Theme } from '@dxos/react-appkit';

import { getAvatarStyle, MemberAvatar } from '../src/components/MemberAvatar';
import FaceIcon from '@material-ui/icons/Face';
import Avatar from '@material-ui/core/Avatar';
import { useTheme } from '@material-ui/styles';

export default {
  title: 'Member Avatar'
};

export const withMemberAvatar = () => {
  const member = {
    publicKey: '16xWXMNUJnXCMUS2rPdqWCKek4iSZvEAHyNXABnhAvwWZQf',
    displayName: 'Test name'
  };

  return (
    <Theme>
      <MemberAvatar member={member} />
    </Theme>
  );
};

export const withGetAvatarStyle = () => {
  const member = {
    publicKey: '16xWXMNUJnXCMUS2rPdqWCKek4iSZvEAHyNXABnhAvwWZQf',
    displayName: 'Test name'
  };

  const ThemeWrapper = () => {
    const theme = useTheme();
    return (
      <Avatar style={getAvatarStyle(theme, member.publicKey)}>
        {member.displayName ? member.displayName.slice(0, 1).toUpperCase() : <FaceIcon />}
      </Avatar>
    );
  };

  return (
    <Theme>
      <ThemeWrapper />
    </Theme>
  );
};
