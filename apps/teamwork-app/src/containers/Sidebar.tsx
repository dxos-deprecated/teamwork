//
// Copyright 2018 Wireline, Inc.
//

import { Chance } from 'chance';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';

import { PartyTreeAddItemButton, PartyTreeItem, useAppRouter, usePads } from '@dxos/react-appkit';

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
      key={document.viewId}
      id={document.viewId}
      label={document.title || document.viewId}
      icon={pads.find(pad => pad.type === document.__type_url)?.icon}
      isSelected={active === document.viewId}
      onSelect={onSelect}
      onUpdate={(title: string) => editItem({ __type_url: document.__type_url, viewId: document.viewId, title })}
    />
  );
};

export const Sidebar = () => {
  const router = useAppRouter();
  const { topic, item: active } = useParams();
  const [pads]: Pad[][] = usePads();
  const { items, createItem, editItem } = useItemList(topic, pads.map(pad => pad.type));
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);

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
    <TreeView>
      {items.map(document => (
        <TreeItem
          key={document.viewId}
          document={document}
          active={active}
          onSelect={() => handleSelect(document.viewId ?? document.objectId!)}
          editItem={editItem}
        />
      ))}

      <PartyTreeAddItemButton topic={topic} onClick={() => setTypeSelectDialogOpen(true)}>Item</PartyTreeAddItemButton>

      <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
    </TreeView>
  );
};
