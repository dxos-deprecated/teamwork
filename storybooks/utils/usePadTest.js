//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

import { createKeyPair } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';

import { examplePadName, exampleUsername } from './constants';

export const usePadTest = ({ registerModel, createItem, createData }) => {
  const client = useClient();
  const [topic, setTopic] = useState();
  const [itemId, setItemId] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    (async () => {
      await client.createProfile({ ...createKeyPair(), username: exampleUsername });
      registerModel && await registerModel(client);
      const party = await client.echo.createParty();
      const tableItem = await createItem({ party }, { name: examplePadName });
      createData && await createData({ party, item: tableItem });
      setTopic(party.key.toHex());
      setItemId(tableItem.id);
    })().catch(setError);
  }, []);

  return { error, topic, itemId };
};

export default usePadTest;
