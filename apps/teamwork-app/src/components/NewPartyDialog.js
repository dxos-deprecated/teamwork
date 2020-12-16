//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { Dialog, DialogContent, DialogActions, Button } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/styles';

import { DialogHeading } from '@dxos/react-appkit';
import { EditableText } from '@dxos/react-ux';

const useStyles = makeStyles(() => ({
  paper: {
    minWidth: 400
  }
}));

const NewPartyDialog = ({ onClose, onCreate }) => {
  const classes = useStyles();

  const [partyName, setPartyName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreate = async () => {
    setIsProcessing(true);
    await onCreate(partyName);
    await onClose();
  };

  return (
    <Dialog open={true} classes={{ paper: classes.paper }}>
      <DialogHeading title='Create party' icon={CreateIcon}/>
      <DialogContent>
        <EditableText
          label='Party name'
          value={partyName}
          variant='outlined'
          autoFocus={true}
          disabled={isProcessing}
          onChange={(name) => setPartyName(name)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={partyName.length === 0 || isProcessing}
          onClick={handleCreate}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewPartyDialog;
