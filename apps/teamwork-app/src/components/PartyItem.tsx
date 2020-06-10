//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import { supportedPads } from '../common';

import { useAppRouter } from '@dxos/react-appkit';

export interface PartyItemProps {
  topic: string,
  item: any,
}

export const PartyItem = ({ item, topic }: PartyItemProps) => {
  const router = useAppRouter();
  const padType = supportedPads.find(pad => pad.type === item.__type_url);
  if (padType === undefined) return null;
  const onClick = () => {
    router.push({ topic, item: item.itemId ?? item.objectId });
  };

  return (<>
    <span onClick={onClick}>{<padType.icon />} this is a {padType.displayName}</span><br />
  </>);
};
