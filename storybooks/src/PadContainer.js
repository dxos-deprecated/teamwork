//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { createKeyPair } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';

import { Generator } from './testing';

/**
 * @param meta Exported Pad meta data.
 * @param {Generator} generator Data generator.
 */
// TODO(burdon): Factor out and convert to TS (move to sdk).
export const useTest = ({ create: createItem, register: registerModel }, generator) => {
  const client = useClient();
  const [error, setError] = useState();
  const [{ topic, itemId }, setTopic] = useState({});

  useEffect(() => {
    (async () => {
      await client.createProfile({ ...createKeyPair(), username: generator.username });
      // TODO(burdon): Why optional?
      registerModel && await registerModel(client);

      const party = await client.echo.createParty();
      const item = await createItem({ party }, { name: generator.title });

      generator && await generator.generate(party, item);

      setTopic({ topic: party.key.toHex(), itemId: item.id });
    })().catch(setError);
  }, []);

  return { error, topic, itemId };
};

/**
 * Wraps the pad.
 * @param meta Exported Pad meta data.
 * @param {Generator} [generator] Data generator.
 */
export const PadContainer = ({ meta, generator = new Generator() }) => {
  const { main: Pad } = meta;
  const { topic, itemId, error } = useTest(meta, generator);
  if (error) {
    throw error;
  }

  if (!topic) {
    return null;
  }

  return (
    <Pad topic={topic} itemId={itemId} />
  );
};

export default PadContainer;
