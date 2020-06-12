//
// Copyright 2018 Wireline, Inc.
//

import { Chance } from 'chance';
import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';

import { keyToString } from '@dxos/crypto';
import { PartyTreeAddItemButton, PartyTree, PartyTreeItem, useAppRouter, usePads } from '@dxos/react-appkit';
import { useClient, useParties } from '@dxos/react-client';

import { useItemList, Item } from '../model';
import { DocumentTypeSelectDialog } from './DocumentTypeSelectDialog';
import { Pad } from '../common';

const chance = new Chance();

interface TreeItemProps {
  document: Item
  active: string
  onSelect: () => void
  editItem: (opts: any) => void,
}

const TreeItem = ({ document, active, onSelect, editItem }: TreeItemProps) => {
  const [pads]: Pad[][] = usePads();
  return (
    <PartyTreeItem
      key={document.itemId}
      id={document.itemId}
      label={document.title || document.itemId}
      icon={pads.find(pad => pad.type === document.__type_url)?.icon}
      isSelected={active === document.itemId}
      onSelect={onSelect}
      onUpdate={(title: string) => editItem({ __type_url: document.__type_url, itemId: document.itemId, title })}
    />
  );
}

interface ItemsProps {
  topic: string
}

/**
 * Channels list.
 */
const Items = ({ topic }: ItemsProps) => {
  const router = useAppRouter();
  const { item: active } = useParams();
  const [pads]: Pad[][] = usePads();
  const { items, createItem, editItem } = useItemList(topic, pads.map(pad => pad.type));

  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);

  if (!topic) {
    return null;
  }

  const handleSelect = (documentId: string) => {
    router.push({ topic, item: documentId });
  };

  const handleCreate = (type?: string) => {
    setTypeSelectDialogOpen(false);
    if (!type) return;
    const title = `item-${chance.word()}`;
    const documentId = createItem({ __type_url: type, title, mutations: [] });
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

      <PartyTreeAddItemButton topic={topic} onClick={() => setTypeSelectDialogOpen(true)}>Item</PartyTreeAddItemButton>

      <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
    </Fragment>
  );
};


export const Sidebar = () => {
  const client = useClient();
  const parties = useParties();
  const router = useAppRouter();
  const { topic } = useParams();

  const handleSelect = (topic: string) => {
    router.push({ topic });
  };

  const handleCreate = async () => {
    const party = await client.partyManager.createParty();
    handleSelect(keyToString(party.publicKey));
  };

  return (
    <PartyTree
      parties={parties}
      items={(topic: string) => <Items topic={topic} />}
      selected={topic}
      onSelect={handleSelect}
      onCreate={handleCreate}
    />
  );
};
