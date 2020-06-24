//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { useTheme } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';

import { red, pink, deepPurple, deepOrange, indigo, blue, cyan, teal, green, amber } from '@material-ui/core/colors';

export const MemberAvatar = ({ member }) => (
  <Avatar style={getAvatarStyle(useTheme(), member.publicKey)}>
    {member.displayName
      ? member.displayName.slice(0, 1).toUpperCase()
      : <FaceIcon />}
  </Avatar>
);

const COLORS = [
  deepOrange[500],
  deepPurple[500],
  red[500],
  pink[500],
  indigo[500],
  blue[500],
  cyan[500],
  teal[500],
  green[500],
  amber[500]
];

const getColor = publicKey => COLORS[parseInt(publicKey.toString('hex').slice(0, 4), 16) % COLORS.length];

export const getAvatarStyle = (theme, publicKey) => {
  const color = getColor(publicKey);
  return {
    backgroundColor: color,
    color: theme.palette.getContrastText(color)
  };
};
