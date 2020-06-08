//
// Copyright 2018 Wireline, Inc.
//

import { Chance } from 'chance';
import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';

import { keyToString } from '@dxos/crypto';
import { PartyTreeAddItemButton, PartyTree, PartyTreeItem, useAppRouter } from '@dxos/react-appkit';
import { useClient, useParties } from '@dxos/react-client';

import { useItemList } from '../model';
import { DocumentTypeSelectDialog } from './DocumentTypeSelectDialog';

const chance = new Chance();

const TreeItem = ({ document, active, onSelect, editItem, pads }) => (
  <PartyTreeItem
    key={document.itemId}
    id={document.itemId}
    label={document.title || document.itemId}
    icon={pads.find(pad => pad.type === document.__type_url)?.icon}
    isSelected={active === document.itemId}
    onSelect={onSelect}
    onUpdate={title => editItem({ __type_url: document.__type_url, itemId: document.itemId, title })}
  />
);

/**
 * Channels list.
 * @param {string} topic Current topic.
 */
const Items = ({ topic, pads }) => {
  const router = useAppRouter();
  const { item: active } = useParams();
  const { items, createItem, editItem } = useItemList(topic, pads.map(pad => pad.type));

  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);

  if (!topic) {
    return null;
  }

  const handleSelect = (documentId) => {
    router.push({ topic, item: documentId });
  };

  const handleCreate = (type) => {
    setTypeSelectDialogOpen(false);
    if (!type) return;
    const title = `item-${chance.word()}`;
    const documentId = createItem({ __type_url: type, title });
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
          pads={pads}
        />
      ))}

      <PartyTreeAddItemButton topic={topic} onClick={() => setTypeSelectDialogOpen(true)}>Item</PartyTreeAddItemButton>

      <DocumentTypeSelectDialog open={typeSelectDialogOpen} pads={pads} onSelect={handleCreate} />
    </Fragment>
  );
};

const Sidebar = ({ pads }) => {
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
      items={topic => <Items topic={topic} pads={pads} />}
      selected={topic}
      onSelect={handleSelect}
      onCreate={handleCreate}
    />
  );
};

export default Sidebar;
