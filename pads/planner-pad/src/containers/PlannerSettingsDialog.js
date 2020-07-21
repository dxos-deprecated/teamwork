//
// Copyright 2020 DXOS.org
//

import React, {useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import Input from '../components/Input';

import { ItemSettings } from '@dxos/react-appkit';

const useStyles = makeStyles(theme => ({
  settingsItem: {
    marginTop: theme.spacing(2)
  }
}));

const PlannerSettingsDialog = ({ open, onClose, onCancel, item, viewModel }) => {
  const classes = useStyles();
  const [description, setDescription] = useState(item.metadata.description);

  const handleClose = ({ name }) => {
    if (item) {
      viewModel.renameView(item.viewId, name);
      viewModel.updateView(item.viewId, {description});
    }
    onClose({ name });
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
        label="Board Description"
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
