//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

import { useClient, useParties } from '@dxos/react-client';
import { AppContainer } from '@dxos/react-appkit';

import { PartyGroup } from '../components/PartyGroup';


export const Landing = () => {
  const client = useClient();
  const parties = useParties();

  async function createParty() {
    await client.partyManager.createParty();
  }

  return (
    <AppContainer>
      {parties.map((party: any) => (<div key={party.publicKey.toString()}>
        <hr />
        <PartyGroup party={party} />
      </div>))}
      <button onClick={createParty}>Create party</button>
    </AppContainer>
  );
};
