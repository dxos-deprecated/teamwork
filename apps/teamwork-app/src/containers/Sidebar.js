//
// Copyright 2018 DXOS.org
//

import { Chance } from 'chance';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';
import { Divider } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';
import { Home } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';

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
  },
  homeButtonLabel: {
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  homeButtonIcon: {
    marginRight: 8
  }
}));

const useHomeTreeItemStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1)
  },

  content: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },

  label: {
    fontWeight: 'inherit',
    color: 'inherit',
    overflow: 'hidden'
  }
}));

export const Sidebar = () => {
  const router = useAppRouter();
  const party = useParty();
  const classes = useStyles();
  const homeTreeItemStyles = useHomeTreeItemStyles();
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
        <TreeItem
          classes={homeTreeItemStyles}
          nodeId={'__home__'}
          label={(
            <div className={classes.homeButtonLabel} onClick={() => router.push({ path: '/landing' })}>
              <Home className={classes.homeButtonIcon} />
              <Typography variant="body2">Home</Typography>
            </div>
          )}
        ></TreeItem>
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
