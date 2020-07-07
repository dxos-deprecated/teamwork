//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { usePads } from '@dxos/react-appkit';

const PadIcon = ({ type }) => {
  const [pads] = usePads();
  const pad = pads.find(pad => {
    console.log(pad.type);
    return pad.type === type;
  });
  return pad ? <pad.icon /> : null;
};

export default PadIcon;
