//
// Copyright 2018 Wireline, Inc.
//

import { Chance } from 'chance';
import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';

import ChatIcon from '@material-ui/icons/Chat';

import { keyToString } from '@dxos/crypto';
import { PartyTreeAddItemButton, PartyTree, PartyTreeItem, useAppRouter } from '@dxos/react-appkit';
import { useClient, useParties } from '@dxos/react-client';
import { useChannelList, useChannel } from '@dxos/messenger-pad';

const chance = new Chance();

const TreeItem = ({ document, topic, active, onSelect }) => {
  const [, updateChannel] = useChannel(topic, document.id);
  return (
    <PartyTreeItem
      key={document.id}
      id={document.id}
      label={document.title || document.id}
      icon={ChatIcon}
      isSelected={active === document.id}
      onSelect={onSelect}
      onUpdate={title => updateChannel({ title })}
    />
  );
};

/**
 * Channels list.
 * @param {string} topic Current topic.
 */
const Channels = ({ topic }) => {
  const router = useAppRouter();
  const { item: active } = useParams();
  const [documents, createDocument] = useChannelList(topic);

  if (!topic) {
    return null;
  }

  const handleSelect = (documentId) => {
    router.push({ topic, item: documentId });
  };

  const handleCreate = () => {
    const title = `channel-${chance.word()}`;
    const documentId = createDocument(title);
    handleSelect(documentId);
  };

  return (
    <Fragment>
      {documents.map(document => (
        <TreeItem
          key={document.id}
          document={document}
          active={active}
          topic={topic}
          onSelect={() => handleSelect(document.id)}
        />
      ))}

      <PartyTreeAddItemButton topic={topic} onClick={handleCreate}>Channel</PartyTreeAddItemButton>
    </Fragment>
  );
};

const Sidebar = () => {
  const client = useClient();
  const parties = useParties();
  const router = useAppRouter();
  const { topic } = useParams();

  const handleSelect = (topic) => {
    router.push({ topic });
  };

  const handleCreate = async () => {
    const party = await client.partyManager.createParty();
    handleSelect(keyToString(party.publicKey));
  };

  return (
    <PartyTree
      parties={parties}
      items={topic => <Channels topic={topic} />}
      selected={topic}
      onSelect={handleSelect}
      onCreate={handleCreate}
    />
  );
};

export default Sidebar;
