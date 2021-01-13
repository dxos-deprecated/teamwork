//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { createKeyPair } from '@dxos/crypto';
import { ClientInitializer } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';

// TODO(burdon): Fix SDK so that config is not required.
const config = {
  swarm: {
    signal: '',
    ice: []
  }
};

// TODO(burdon): Better replaced with hooks.
/*
// Util.
const usePadTest = () => {
  const client = useClient();
  const [topic, setTopic] = useState();
  const [itemId, setItemId] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    (async () => {
      // TODO(burdon): Never put string literals in code.
      await client.createProfile({ ...createKeyPair(), username: 'Alice' });
      registerModel && await registerModel(client);
      const party = await client.echo.createParty();
      const tableItem = await createItem({ party }, { name: 'Alice\'s pad' });
      createData && await createData({ party, item: tableItem });
      setTopic(party.key.toHex());
      setItemId(tableItem.id);
    })().catch(setError);
  }, []);

  return { error, topic, itemId };
};

// Story.
import Tasks from '@dxos/tasks-pad';

export const withTasksPad = () => {
  const { topic, itemId } = usePadTest();
  if (!topic) {
    return null;
  }

  return (
    <Tasks topic={topic} itemId={itemId} />
  );
};
*/

export const StorybookInitializer = ({ pad, createItem, registerModel, createData }) => {
  return (
    <ClientInitializer config={config}>
      <PartyInitializer
        createItem={createItem}
        pad={pad}
        registerModel={registerModel}
        createData={createData}
      />
    </ClientInitializer>
  );
};

function PartyInitializer ({ pad: Pad, createItem, registerModel, createData }) {
  const [ready, setReady] = useState(false);
  const [topic, setTopic] = useState();
  const [itemId, setItemId] = useState();
  const client = useClient();
  const [error, setError] = useState();

  useEffect(() => {
    (async () => {
      // TODO(burdon): Never put string literals in code.
      await client.createProfile({ ...createKeyPair(), username: 'Alice' });
      registerModel && await registerModel(client);
      const party = await client.echo.createParty();
      const tableItem = await createItem({ party }, { name: 'Alice\'s pad' });
      createData && await createData({ party, item: tableItem });
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

export default StorybookInitializer;
