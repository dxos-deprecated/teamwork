//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

import { useClient, useParties } from '@dxos/react-client';

import { PartyGroup } from '../components/PartyGroup';

export const Landing = () => {
  const parties = useParties();

  return (<>
    <div>Welcome to DxOS</div>
    {parties.map((party: any) => <PartyGroup key={party.publicKey.toString()} party={party} />)}
  </>);
};
