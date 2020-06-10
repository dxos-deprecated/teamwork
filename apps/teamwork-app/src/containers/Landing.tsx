//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

import { useParties } from '@dxos/react-client';

import { PartyGroup } from '../components/PartyGroup';

export const Landing = () => {
  const parties = useParties();

  return (<>
    <div>Welcome to DxOS</div>
    {parties.map((party: any) => (<div key={party.publicKey.toString()}>
      <hr />
      <PartyGroup party={party} />
    </div>))}
  </>);
};
