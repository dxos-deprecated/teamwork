//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

import { EditableText } from '@dxos/react-ux';

const NewPartyDialog = ({ onClose, onCreate }) => {
  const [partyName, setPartyName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreate = async () => {
    setIsProcessing(true);
    await onCreate(partyName);
    await onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        Create new party
      </DialogTitle>
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
