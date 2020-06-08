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

import { useItemList } from '../model';

const chance = new Chance();

const TreeItem = ({ document, active, onSelect, editItem }) => (
  <PartyTreeItem
    key={document.itemId}
    id={document.itemId}
    label={document.title || document.itemId}
    icon={ChatIcon}
    isSelected={active === document.itemId}
    onSelect={onSelect}
    onUpdate={title => editItem({ __type_url: document.__type_url, itemId: document.itemId, title })}
  />
);

/**
 * Channels list.
 * @param {string} topic Current topic.
 */
const Channels = ({ topic }) => {
  const router = useAppRouter();
  const { item: active } = useParams();
  const { items, createItem, editItem } = useItemList(topic, ['testing.messenger.Channel']);

  if (!topic) {
    return null;
  }

  const handleSelect = (documentId) => {
    router.push({ topic, item: documentId });
  };

  const handleCreate = () => {
    const title = `channel-${chance.word()}`;
    const documentId = createItem({ __type_url: 'testing.messenger.Channel', title });
    handleSelect(documentId);
  };

  return (
    <Fragment>
      {items.map(document => (
        <TreeItem
          key={document.itemId}
          document={document}
          active={active}
          onSelect={() => handleSelect(document.itemId)}
          editItem={editItem}
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
