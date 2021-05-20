//
// Copyright 2020 DXOS.org
//

import discoverySwarmWebRTC from '@geut/discovery-swarm-webrtc';
import { useState, useEffect, useRef } from 'react';

import { keyToBuffer, discoveryKey } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';

const CHANNEL_EDITOR_STATUS = 'editor.status';

export const useDataChannel = (channelId) => {
  const connections = useRef({});
  const [data, setData] = useState();
  const client = useClient();

  const { signal, ice } = client.config.swarm;

  useEffect(() => {
    const swarm = discoverySwarmWebRTC({
      bootstrap: [signal],
      simplePeer: {
        config: {
          iceServers: ice
        }
      },
      maxPeers: 1024
    });

    swarm.on('connection', function (peer, info) {
      const connectionId = info.id.toString('hex');

      connections.current = { ...(connections.current || {}), [connectionId]: peer };

      peer.on('data', data => {
        try {
          const { type, update } = JSON.parse(data);

          if (type !== CHANNEL_EDITOR_STATUS) {
            return;
          }

          setData(Object.values(update));
        } catch (error) {
          // Parsing error.
          // Probably this data message is not for us
          console.warn(error);
        }
      });
    });

    swarm.on('connection-closed', function (_, info) {
      delete connections.current[info.id.toString('hex')];
    });

    const channelBuffer = discoveryKey(keyToBuffer(channelId));

    swarm.join(channelBuffer);

    return () => {
      swarm.leave(channelBuffer);
    };
  }, []);

  function broadcast (update) {
    try {
      Object.values(connections.current).forEach(peer => peer.send(JSON.stringify({ type: CHANNEL_EDITOR_STATUS, update })));
    } catch (error) {
      console.warn(error);
      // Peer disconnected?
    }
  }

  return [data, broadcast];
};
