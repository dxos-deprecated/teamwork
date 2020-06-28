//
// Copyright 2018 DXOS.org
//

import { Chance } from 'chance';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';

import { PartyTreeAddItemButton, PartyTreeItem, useAppRouter, usePads } from '@dxos/react-appkit';

import { useItems } from '../model';
import { DocumentTypeSelectDialog } from './DocumentTypeSelectDialog';

const chance = new Chance();

export const Sidebar = () => {
  const router = useAppRouter();
  const { topic, item: active } = useParams();
  const [pads] = usePads();
  const model = useItems(topic);
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);

  const handleSelect = (viewId) => {
    router.push({ topic, item: viewId });
  };

  const handleCreate = (type) => {
    setTypeSelectDialogOpen(false);
    if (!type) return;
    const title = `item-${chance.word()}`;
    const viewId = model.createView(type, title);
    handleSelect(viewId);
  };

  return (
    <TreeView>
      {model.getAllViews().map(view => (
        <PartyTreeItem
          key={view.viewId}
          id={view.viewId}
          label={view.displayName}
          icon={pads.find(pad => pad.type === view.type)?.icon}
          isSelected={active === view.viewId}
          onSelect={() => handleSelect(view.viewId)}
          onUpdate={(title) => model.renameView(view.viewId, title)}
        />
      ))}

      <PartyTreeAddItemButton topic={topic} onClick={() => setTypeSelectDialogOpen(true)}>Item</PartyTreeAddItemButton>

      <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
    </TreeView>
  );
};
