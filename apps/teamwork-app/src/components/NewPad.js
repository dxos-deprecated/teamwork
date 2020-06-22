//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { Chance } from 'chance';
import { makeStyles } from '@material-ui/styles';
import { Add } from '@material-ui/icons';
import { Typography, IconButton } from '@material-ui/core';

import { useAppRouter } from '@dxos/react-appkit';

import { DocumentTypeSelectDialog } from '../containers/DocumentTypeSelectDialog';

const chance = new Chance();

const useStyles = makeStyles({
  cardOutline: {
    padding: '24px',
    border: '2px dashed #D8E0E3',
    borderRadius: '8px',
    textAlign: 'center',
    width: 250,
    height: 300
  },
  addButton: {
    marginTop: 52,
    padding: 24
  },
  addIcon: {
    width: 48,
    height: 48
  },
  addSubtitle: {
    color: '#D8E0E3',
    marginTop: 24
  }
});

export const NewPad = ({ topic, createItem }) => {
  const router = useAppRouter();
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);

  const classes = useStyles();

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

  return (<>
    <div className={classes.cardOutline}>
      <IconButton className={classes.addButton} onClick={() => setTypeSelectDialogOpen(true)}>
        <Add className={classes.addIcon} htmlColor="#D8E0E3" />
      </IconButton>
      <Typography className={classes.addSubtitle} variant="h5">Create new item</Typography>
    </div>
    <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
  </>);
};
