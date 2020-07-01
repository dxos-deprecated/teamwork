//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import { useHistory } from 'react-router-dom';

import ListIcon from '@material-ui/icons/List';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

import { humanize, keyToString } from '@dxos/crypto';
import { useClient, useParties } from '@dxos/react-client';

import Header from '../components/Header';

const Home = () => {
  const history = useHistory();
  const parties = useParties();
  const client = useClient();

  // Create new topic.
  const handleCreateParty = async () => {
    const party = await client.partyManager.createParty();
    console.log(`Created party: ${keyToString(party.publicKey)}`);
  };

  return (
    <div>
      <Header onAdd={handleCreateParty}>Parties for {client.partyManager.identityManager.displayName}</Header>

      <Paper>
        <List dense>
          {parties
            .map(party => keyToString(party.publicKey))
            .map(topic => (
              <ListItem
                key={topic}
                button
                onClick={() => history.push(`/${topic}`)}
              >
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary={humanize(topic)} />
              </ListItem>
            ))}
        </List>
      </Paper>
    </div>
  );
};

export default Home;
