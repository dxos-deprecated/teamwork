//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import { supportedPads } from '../common';

export interface PartyItemProps {
  item: any,
}

export const PartyItem = ({ item }: PartyItemProps) => {
  const padType = supportedPads.find(pad => pad.type === item.__type_url);
  if (padType === undefined) return null;

  return (<>
    <span>{<padType.icon />} this is a {padType.displayName}</span><br />
  </>);
};
