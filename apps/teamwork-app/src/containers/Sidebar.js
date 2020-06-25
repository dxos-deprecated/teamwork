//
// Copyright 2018 Wireline, Inc.
//

import { Chance } from 'chance';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { PartyTreeAddItemButton, PartyTreeItem, useAppRouter, usePads, MemberList } from '@dxos/react-appkit';
import { useParty } from '@dxos/react-client';

import { useItems } from '../model';
import { DocumentTypeSelectDialog } from './DocumentTypeSelectDialog';

const chance = new Chance();

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: '1fr auto',
    flex: 1
  }
}));

export const Sidebar = () => {
  const router = useAppRouter();
  const party = useParty();
  const classes = useStyles();
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
    <div className={classes.root}>
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

      </TreeView>
      <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
      <Divider />
      <MemberList party={party} />
    </div>
  );
};
