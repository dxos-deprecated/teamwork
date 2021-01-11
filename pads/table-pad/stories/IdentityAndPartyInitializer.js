//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { createKeyPair } from '@dxos/crypto';
import { ClientInitializer } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';

const config = {
  swarm: {
    signal: '',
    ice: []
  }
};

export const IdentityAndPartyInitializer = ({ pad, createItem }) => {
  return (
    <ClientInitializer config={config}>
      <PartyInitializer createItem={createItem} pad={pad}/>
    </ClientInitializer>
  );
};

function PartyInitializer ({ pad: Pad, createItem }) {
  const [ready, setReady] = useState(false);
  const [topic, setTopic] = useState();
  const [itemId, setItemId] = useState();
  const client = useClient();
  const [error, setError] = useState();

  useEffect(() => {
    (async () => {
      await client.createProfile({ ...createKeyPair(), username: 'Alice' });
      const party = await client.echo.createParty();
      const tableItem = await createItem({ party }, { name: 'Alice\'s table' });
      setItemId(tableItem.id);
      setTopic(party.key.toHex());
      setReady(true);
    })().catch(setError);
  }, []);

  if (error) {
    return <p>{String(error)}</p>;
  }

  if (!ready) {
    return null;
  }

  return <Pad topic={topic} itemId={itemId} />;
}
