//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { Theme } from '@dxos/react-appkit';

import MemberAvatar from '../src/components/MemberAvatar';

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
