//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { usePads } from '@dxos/react-appkit';

export const DocumentTypeSelectMenu = ({ anchorEl, onSelect, open }) => {
  const [pads] = usePads();
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={() => onSelect(undefined)}>
      {pads.map(pad => (
        <MenuItem button key={pad.type} onClick={() => onSelect(pad.type)}>
          <ListItemIcon>
            <pad.icon />
          </ListItemIcon>
          <ListItemText primary={pad.displayName} secondary={pad.description} />
        </MenuItem>
      ))}
    </Menu>
  );
};
