//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

import { useClient, useParties } from '@dxos/react-client';

import { PartyGroup } from '../components/PartyGroup';

export const Landing = () => {
  const client = useClient();
  const parties = useParties();

  async function createParty() {
    await client.partyManager.createParty();
  }

  return (<>
    <div>Welcome to DxOS</div>
    {parties.map((party: any) => (<div key={party.publicKey.toString()}>
      <hr />
      <PartyGroup party={party} />
    </div>))}
    <button onClick={createParty}>Create party</button>
  </>);
};
