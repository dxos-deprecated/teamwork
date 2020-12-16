//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/icons/AssignmentTurnedIn';
import SettingsIcon from '@material-ui/icons/Settings';

import { ItemSettings } from '@dxos/react-appkit';

import Input from '../components/Input';

const useStyles = makeStyles(theme => ({
  settingsItem: {
    marginTop: theme.spacing(2)
  },
  initializeButton: {}
}));

const PlannerSettingsDialog = ({
  open,
  onClose,
  onCancel,
  item
}) => {
  const classes = useStyles();
  const [description, setDescription] = useState('');

  useEffect(() => {
    setDescription(item ? item.model.getProperty('description') : '');
  }, [item]);

  const handleClose = ({ name }) => {
    if (item) {
      item.model.setProperty('title', name);
      item.model.setProperty('description', description);
    }
    onClose({ name }, { description });
  };

  return (
    <ItemSettings
      open={open}
      onClose={handleClose}
      onCancel={onCancel}
      item={item}
      closingDisabled={false}
      icon={<SettingsIcon />}
    >
      <Input
        label="Description"
        multiline
        className={classes.settingsItem}
        key={description}
        value={description ?? ''}
        onUpdate={description => setDescription(description)}
      />
    </ItemSettings>
  );
};

export default PlannerSettingsDialog;
