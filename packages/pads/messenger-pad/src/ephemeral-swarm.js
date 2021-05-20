//
// Copyright 2020 DXOS.org
//

import discoverySwarmWebRTC from '@geut/discovery-swarm-webrtc';
import { useState, useEffect } from 'react';

import { keyToBuffer, discoveryKey } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';

/**
 * Hook used for joining peers into an ad-hoc, ephemeral swarm.
 * It can be used for joining the peers next to an existing party connection.
 * Ad-hoc, because the connection can be quickly created anytime.
 * Ephemeral because no data about the swarm is stored permanently.
 * **Known limitation** - Currently the ephemeral swarm will not work properly
 * for audio/video chats with more than 2 users (unless/until full connection
 * or stream replication is implemented)
 * @param  {string} channelId - Id of the channel used for connecting the peers
 */
export const useEphemeralSwarm = (channelId) => {
  const [connections, setConnections] = useState([]);
  const [streams, setStreams] = useState([]);
  const [metaData, setMetaData] = useState({});
  const client = useClient();
  const channelDiscoveryKey = discoveryKey(keyToBuffer(`${channelId}-video`));

  useEffect(() => {
    const { signal, ice } = client.config.swarm;
    const swarm = discoverySwarmWebRTC({
      bootstrap: [signal],
      simplePeer: {
        config: {
          iceServers: ice
        }
      },
      maxPeers: 1024
    });

    swarm.on('connection', () => console.log('We have a new ephemeral connection'));
    swarm.on('connection-closed', () => console.log('Ephemeral connection gone'));

    swarm.on('connection', (peer, info) => {
      const connectionId = info.id.toString();
      const newPeer = { peer, connectionId };
      setConnections((peers) => [...peers, newPeer]);

      peer.on('stream', (mediaStream) => {
        setStreams(streams => [...streams, { mediaStream, connectionId }]);
        mediaStream.addEventListener('removetrack', () => {
          if (mediaStream.getTracks().length === 0) {
            setStreams(streams => streams.filter(item => item.mediaStream.id !== mediaStream.id));
          }
        });
      });

      peer.on('data', (data) => {
        const metaData = JSON.parse(data.toString());
        // new meta data replaces old one from the same peer
        setMetaData(oldMetaData => ({
          ...oldMetaData,
          [connectionId]: metaData
        }));
      });
    });

    swarm.on('connection-closed', (_, info) => {
      setStreams((streams) => streams.filter(item => item.connectionId !== info.id.toString()));
      setConnections((connections) => connections.filter(item => item.connectionId !== info.id.toString()));
    });

    swarm.join(channelDiscoveryKey);

    return () => {
      swarm.leave(channelDiscoveryKey);
    };
  }, []);

  const streamsWithMetaData = streams.map(stream => ({
    ...stream,
    metaData: metaData[stream.connectionId] || {}
  }));

  return [connections, streams, streamsWithMetaData];
};
