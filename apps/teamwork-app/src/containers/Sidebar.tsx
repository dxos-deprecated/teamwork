//
// Copyright 2018 Wireline, Inc.
//

import { Chance } from 'chance';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';

import { PartyTreeAddItemButton, PartyTreeItem, useAppRouter, usePads } from '@dxos/react-appkit';

import { useViewList } from '../model';
import { DocumentTypeSelectDialog } from './DocumentTypeSelectDialog';
import { Pad } from '../common';

const chance = new Chance();

export const Sidebar = () => {
  const router = useAppRouter();
  const { topic, item: active } = useParams();
  const [pads]: Pad[][] = usePads();
  const viewsModel = useViewList(topic);
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);

  const handleSelect = (viewId: string) => {
    router.push({ topic, item: viewId });
  };

  const handleCreate = (type?: string) => {
    setTypeSelectDialogOpen(false);
    if (!type) return;
    const title = `item-${chance.word()}`;
    const viewId = viewsModel.createView(type, title);
    handleSelect(viewId);
  };

  return (
    <TreeView>
      {viewsModel.getAllViews().map(document => (
        <PartyTreeItem
          key={document.viewId}
          id={document.viewId}
          label={document.title || document.viewId}
          icon={pads.find(pad => pad.type === document.__type_url)?.icon}
          isSelected={active === document.viewId}
          onSelect={() => handleSelect(document.viewId)}
          onUpdate={(title: string) => viewsModel.editView(document.viewId, { title })}
        />
      ))}

      <PartyTreeAddItemButton topic={topic} onClick={() => setTypeSelectDialogOpen(true)}>Item</PartyTreeAddItemButton>

      <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
    </TreeView>
  );
};
