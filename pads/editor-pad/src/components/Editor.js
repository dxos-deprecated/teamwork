//
// Copyright 2020 DXOS.org
//

import React, { useCallback, useState, useEffect, useRef } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Alert from '@material-ui/lab/Alert';

import { Editor as DXOSEditor } from '@dxos/editor';
import { docToMarkdown, markdownToDoc } from '@dxos/editor-core';
import MessengerPad from '@dxos/messenger-pad';
import { IpfsHelper } from '@dxos/react-appkit';
import { useProfile, useConfig } from '@dxos/react-client';

import { useDataChannel } from '../data-channel';
import { useDocumentUpdateModel } from '../model';
import MarkdownIcon from './MarkdownIcon';
import Pad from './Pad';

const useEditorClasses = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  padContainer: {
    maxWidth: '740px'
  },
  padDivider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  editor: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),

    '& reactelement': {
      display: 'inline-block'
    }
  },
  snackButton: {
    '&:first-child': {
      marginLeft: theme.spacing(8)
    },

    marginLeft: theme.spacing()
  },
  snackAlertMessage: {
    padding: '3px 0 0'
  }
}));

const useContextMenuHandlers = ({ topic, pads, items, onCreateItem, editor }) => {
  function handleContextMenuGetOptions () {
    let insertOptions = items.map(item => ({
      id: item.id,
      label: item.model.getProperty('title') || 'Untitled',
      fn: () => {
        editor.createReactElement({
          type: item.type,
          itemId: item.id,
          title: item.model.getProperty('title') || 'Untitled',
          topic
        });
      }
    }));

    if (insertOptions.length > 0) {
      insertOptions = [{ subheader: 'Insert items' }, ...insertOptions];
    }

    let createItemOptions = onCreateItem === undefined ? [] : pads.map(pad => ({
      id: `create-${pad.type}`,
      label: `New ${pad.displayName}`,
      create: true,
      fn: async () => {
        const item = await onCreateItem(pad.type);

        editor.createReactElement({
          type: pad.type,
          itemId: item.id,
          title: item.model.getProperty('title') || 'Untitled',
          topic
        });
      }
    }));

    if (createItemOptions.length > 0) {
      createItemOptions = [{ subheader: 'Create items' }, ...createItemOptions];
    }

    return [...insertOptions, ...createItemOptions];
  }

  function handleContextMenuRenderItem ({ option }) {
    return (
      <ListItemText
        primary={option.label}
      />
    );
  }

  const handleContextMenuOptionSelect = useCallback(option => {
    if (option.fn) {
      return option.fn();
    }
  }, []);

  return {
    handleContextMenuGetOptions,
    handleContextMenuRenderItem,
    handleContextMenuOptionSelect
  };
};

export const Editor = ({ topic, itemId, title, pads = [], items = [], onCreateItem = undefined, onToggleMessenger = undefined }) => {
  const downloadLink = useRef();
  const classes = useEditorClasses();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [loadFromIpfsDialogOpen, setLoadFromIpfsDialogOpen] = useState(false);
  const [loadFromIpfsCid, setLoadFromIpfsCid] = useState('');
  const [loadFromIpfsError, setLoadFromIpfsError] = useState(null);

  const [editor, setEditor] = useState();

  const { publicKey, username } = useProfile();
  const [statusData, broadcastStatus] = useDataChannel(itemId);

  const config = useConfig();
  const ipfs = new IpfsHelper(config.services.ipfs.gateway);

  const customButtons = onToggleMessenger ? [
    {
      name: 'messenger',
      title: 'Messenger',
      icon: MessengerPad.icon,
      onClick: onToggleMessenger,
      enabled: () => true,
      active: () => false
    },
    { divider: true },
    {
      name: 'download_markdown',
      title: 'Download as Markdown',
      icon: MarkdownIcon,
      onClick: () => {
        const text = docToMarkdown(documentUpdateModel.doc);
        downloadLink.current.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        downloadLink.current.click();
      },
      enabled: () => true,
      active: () => false
    },
    { divider: true },
    {
      name: 'save_ipfs',
      title: 'Upload to IPFS as Markdown',
      icon: CloudUploadIcon,
      onClick: async () => {
        const text = docToMarkdown(documentUpdateModel.doc);

        const mdFile = new File([text], { type: 'text/markdown' });

        const cid = await ipfs.upload(mdFile, mdFile.type);
        const url = ipfs.url(cid);

        setSnackbarMessage(
          <>
            Document uploaded to IPFS!
            <Button
              href={url}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              color="inherit"
              size="small"
              className={classes.snackButton}
            >
              Open
            </Button>
            <CopyToClipboard text={url}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                className={classes.snackButton}
              >COPY</Button>
            </CopyToClipboard>
          </>
        );

        setSnackbarOpen(true);
      },
      enabled: () => true,
      active: () => false
    },
    {
      name: 'load_ipfs',
      title: 'Load from IPFS',
      icon: CloudDownloadIcon,
      onClick: () => {
        setLoadFromIpfsDialogOpen(true);
      },
      enabled: () => true,
      active: () => false
    }
  ] : [];

  const documentUpdateModel = useDocumentUpdateModel(topic, itemId);

  function handleEditorCreated (editor) {
    // Set peer name for status
    editor.sync.status.setUserName(username);

    setEditor(editor);
  }

  function handleReactElementRender (props) {
    const { main: PadComponent, icon } = pads.find(pad => pad.type === props.type);

    return (
      <div className={classes.padContainer}>
        <Divider className={classes.padDivider} />
        <Pad title={props.title} icon={icon}>
          <PadComponent {...props} embedded={true} />
        </Pad>
        <Divider className={classes.padDivider} />
      </div>
    );
  }

  async function handleImageUpload (imageFile) {
    const cid = await ipfs.upload(imageFile, imageFile.type);
    return ipfs.url(cid);
  }

  function handleSnackbarClose (event, reason) {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
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

      setSnackbarMessage('Document loaded from IPFS!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setLoadFromIpfsError(error.message);
    }
  }

  // When copy image from an http URL
  // async function imageSrcParser (imageSrc) {
  //   if (imageSrc.startsWith(config.services.ipfs.gateway)) return imageSrc;

  //   const imageResponse = await fetch(imageSrc);
  //   const imageFile = await imageResponse.blob();
  //   const cid = await ipfs.upload(imageFile, imageFile.type);
  //   return ipfs.url(cid);
  // }

  const {
    handleContextMenuGetOptions,
    handleContextMenuRenderItem,
    handleContextMenuOptionSelect
  } = useContextMenuHandlers({ topic, pads, items, onCreateItem, editor });

  useEffect(() => {
    if (statusData) {
      editor.sync.status.processRemoteUpdate(statusData);
    }
  }, [statusData]);

  if (!documentUpdateModel) return null;

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={5000}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={handleSnackbarClose}
          classes={{
            message: typeof snackbarMessage !== 'string' ? classes.snackAlertMessage : undefined
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

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

      <a ref={downloadLink} download={`${title}.md`} style={{ display: 'none' }} />

      <DXOSEditor
        toolbar={{ customButtons }}
        schema="full"
        sync={{
          id: publicKey,
          doc: documentUpdateModel.doc,
          status: {
            onLocalUpdate: broadcastStatus
          }
        }}
        contextMenu={{
          getOptions: handleContextMenuGetOptions,
          onSelect: handleContextMenuOptionSelect,
          renderItem: handleContextMenuRenderItem
        }}
        onImageUpload={handleImageUpload}
        // imageSourceParser={imageSrcParser}
        onCreated={handleEditorCreated}
        reactElementRenderFn={handleReactElementRender}
        classes={classes}
        initialFontSize={14}
      />
    </>
  );
};
