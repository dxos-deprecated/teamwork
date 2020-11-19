//
// Copyright 2020 DXOS.org
//

import { useClient } from '@dxos/react-client';
import { createKeyPair } from '@dxos/crypto';
import { renderHook } from '@testing-library/react-hooks';

import { useChannelMessages } from '../src/hooks/model';

describe('Test useChannelMessages()', () => {
  const client = useClient();
  let topic;

  beforeAll(async () => {
    const party = await client.echo.createParty();
    topic = party.key();
  });

  it('Send message', () => {
    const [];
  });

  it('Get messages', () => {

  });
});
