//
// Copyright 2018 Wireline, Inc.
//

import { Chance } from 'chance';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';

import { PartyTreeAddItemButton, PartyTreeItem, useAppRouter, usePads } from '@dxos/react-appkit';

import { useItemList } from '../model';
import { DocumentTypeSelectDialog } from './DocumentTypeSelectDialog';

const chance = new Chance();

export const Sidebar = () => {
  const router = useAppRouter();
  const { topic, item: active } = useParams();
  const [pads] = usePads();
  const { items, createItem, editItem } = useItemList(topic, pads.map(pad => pad.type));
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);

  const handleSelect = (viewId) => {
    router.push({ topic, item: viewId });
  };

  const handleCreate = (type) => {
    setTypeSelectDialogOpen(false);
    if (!type) return;
    const title = `item-${chance.word()}`;
    const viewId = createItem(type, title);
    handleSelect(viewId);
  };

  return (
    <TreeView>
      {items.map(document => (
        <PartyTreeItem
          key={document.viewId}
          id={document.viewId}
          label={document.title || document.viewId}
          icon={pads.find(pad => pad.type === document.__type_url)?.icon}
          isSelected={active === document.viewId}
          onSelect={() => handleSelect(document.viewId)}
          onUpdate={(title) => editItem(document.__type_url, document.viewId, title)}
        />
      ))}

      <PartyTreeAddItemButton topic={topic} onClick={() => setTypeSelectDialogOpen(true)}>Item</PartyTreeAddItemButton>

      <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
    </TreeView>
  );
};
