//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/icons/AssignmentTurnedIn';

import { ObjectModel } from '@dxos/echo-db';
import { ItemSettings } from '@dxos/react-appkit';
import { useModel } from '@dxos/react-client';

import Input from '../components/Input';
import { LIST_TYPE, useList } from '../model/list';

const useStyles = makeStyles(theme => ({
  settingsItem: {
    marginTop: theme.spacing(2)
  },
  initializeButton: {}
}));

const PlannerSettingsDialog = ({ topic, open, onClose, onCancel, item, viewModel, listsModel }) => {
  const lists = listsModel ? listsModel.getObjectsByType(LIST_TYPE) : undefined;
  const classes = useStyles();
  const newListsModel = useModel({ model: ObjectModel, options: { type: LIST_TYPE, topic } });
  const [description, setDescription] = useState(item ? item.metadata.description : '');
  const [pendingInitialization, setPendingInitialization] = useState(false);
  const initialized = lists ? lists.length > 0 : false;

  const handleClose = ({ name }) => {
    const initializeKanban = (viewId) => {
      if (!pendingInitialization) return;
      newListsModel.createItem(LIST_TYPE, { topic, viewId, title: 'TODO', position: 0 }, viewId);
      newListsModel.createItem(LIST_TYPE, { topic, viewId, title: 'In Progress', position: 1 }, viewId);
      newListsModel.createItem(LIST_TYPE, { topic, viewId, title: 'Done', position: 2 }, viewId);
    };

    if (item) {
      viewModel.renameView(item.viewId, name);
      viewModel.updateView(item.viewId, { description });
      initializeKanban(item.viewId);
    }
    onClose({ name }, { description }, initializeKanban);
  };

  return (
    <ItemSettings
      open={open}
      onClose={handleClose}
      onCancel={onCancel}
      item={item}
      closingDisabled={false}
      icon={<Icon />}
    >
      <Input
        label="Description"
        multiline
        className={classes.settingsItem}
        key={description}
        value={description ?? ''}
        onUpdate={description => setDescription(description)}
      />
      <Button
          variant="outlined"
          size="small"
          disabled={initialized || pendingInitialization}
          onClick={() => setPendingInitialization(true)}
          className={clsx(classes.settingsItem, classes.initializeButton)}
        >
          Initialize
        </Button>
    </ItemSettings>
  );
};

export default PlannerSettingsDialog;
