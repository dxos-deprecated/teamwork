//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import { docToMarkdown, markdownToDoc } from '@dxos/editor-core';
import { IpfsHelper } from '@dxos/react-appkit';
import { useConfig } from '@dxos/react-client';

import { useDocumentUpdateModel } from '../model';

function IpfsMenu ({ topic, itemId, onUploaded, onImported }) {
  const config = useConfig();
  const ipfs = new IpfsHelper(config.ipfs.gateway);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loadFromIpfsDialogOpen, setLoadFromIpfsDialogOpen] = useState(false);
  const [loadFromIpfsCid, setLoadFromIpfsCid] = useState('');
  const [loadFromIpfsError, setLoadFromIpfsError] = useState(null);

  const documentUpdateModel = useDocumentUpdateModel(topic, itemId);

  function handleClick (event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose () {
    setAnchorEl(null);
  }

  function handleImport () {
    setLoadFromIpfsDialogOpen(true);
    handleClose();
  }

  async function handleUpload () {
    const text = docToMarkdown(documentUpdateModel.doc);

    const mdFile = new File([text], { type: 'text/markdown' });

    const cid = await ipfs.upload(mdFile, mdFile.type);
    const url = ipfs.url(cid);

    onUploaded(url);
    handleClose();
  }

  function handleLoadFromIpfsDialogClose () {
    setLoadFromIpfsDialogOpen(false);
    setLoadFromIpfsError(null);
    setLoadFromIpfsCid('');
  }

  function handleLoadFromIPFSChange (event) {
    setLoadFromIpfsCid(event.target.value);
  }

  async function handleLoadFromIPFS () {
    try {
      const text = await ipfs.download(loadFromIpfsCid);

      markdownToDoc(text, documentUpdateModel.doc);

      handleLoadFromIpfsDialogClose();

      onImported();
    } catch (error) {
      console.error(error);
      setLoadFromIpfsError(error.message);
    }
  }

  return (
    <>
      <Dialog
        open={loadFromIpfsDialogOpen}
        onClose={handleLoadFromIpfsDialogClose}
        maxWidth='sm'
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Load document from IPFS</DialogTitle>
        <DialogContent>
          <TextField
            value={loadFromIpfsCid}
            onChange={handleLoadFromIPFSChange}
            autoFocus
            margin="dense"
            label="CID"
            type="text"
            fullWidth
            required
            error={Boolean(loadFromIpfsError)}
            helperText={loadFromIpfsError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoadFromIpfsDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLoadFromIPFS} color="primary">
            Load
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        aria-controls="ipfs-menu"
        aria-haspopup="true"
        title='IPFS options'
        onClick={handleClick}
      >
        IPFS
      </Button>
      <Menu
        id="ipfs-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleImport}>Import</MenuItem>
        <MenuItem onClick={handleUpload}>Upload</MenuItem>
      </Menu>
    </>
  );
}

export default IpfsMenu;
