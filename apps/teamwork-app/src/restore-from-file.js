//
// Copyright 2020 DXOS.org
//

import { schema } from '@dxos/echo-protocol';

export const restoreFromFile = async (client, data) => {
  const bufferData = Buffer.from(data, 'hex')
  const decodedSnapshot = schema.getCodecForType('dxos.echo.snapshot.DatabaseSnapshot').decode(bufferData);
  const restoredParty = await client.createPartyFromSnapshot(decodedSnapshot)

  // console.log('restoredParty', restoredParty)
  return restoredParty
}
