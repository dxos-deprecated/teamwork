//
// Copyright 2020 DXOS.org
//
import React, { useCallback, useState, useEffect, useRef } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { Editor as DXOSEditor } from '@dxos/editor';
import { docToMarkdown } from '@dxos/editor-core';
import MessengerPad from '@dxos/messenger-pad';
import { IpfsHelper } from '@dxos/react-appkit';
import { useProfile, useConfig } from '@dxos/react-client';

import { useDataChannel } from '../data-channel';
import { useDocumentUpdateModel } from '../model';
import IpfsMenu from './IpfsMenu';
import MarkdownMenu from './MarkdownMenu';
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
      label: item.displayName,
      fn: () => {
        editor.createReactElement({
          type: item.type,
          itemId: item.itemId,
          title: item.displayName,
          topic
        });
      }
    }));

    if (insertOptions.length > 0) {
      insertOptions = [{ subheader: 'Insert items' }, ...insertOptions];
    }

    let createItemOptions = pads.map(pad => ({
      id: `create-${pad.type}`,
      label: `New ${pad.displayName}`,
      create: true,
      fn: async () => {
        const item = await onCreateItem(pad.type);

        editor.createReactElement({
          type: pad.type,
          itemId: item.itemId,
          title: item.displayName,
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

export const Editor = ({
  topic,
  itemId,
  title,
  pads = [],
  items = [],
  onCreateItem,
  onEditorCreated,
  onToggleMessenger,
  onToggleMarkdownView
}) => {
  const downloadLink = useRef();
  const classes = useEditorClasses();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [editor, setEditor] = useState();

  const { publicKey, username } = useProfile();
  const [statusData, broadcastStatus] = useDataChannel(itemId);

  const config = useConfig();
  const ipfs = new IpfsHelper(config.ipfs.gateway);

  const documentUpdateModel = useDocumentUpdateModel(topic, itemId);

  const customButtons = [
    { divider: true },
    {
      name: 'markdown',
      component: () => (
        <MarkdownMenu
        onDownload={handleMarkdownDownload}
        onPreviewOpen={onToggleMarkdownView}
        />
      )
    },
    { divider: true },
    {
      name: 'ipfs',
      component: () => (
        <IpfsMenu
          topic={topic}
          itemId={itemId}
          onImported={handleIpfsImported}
          onUploaded={handleIpfsUploaded}
        />
      )
    },
    { divider: true },
    onToggleMessenger ? {
      name: 'messenger',
      title: 'Messenger',
      icon: MessengerPad.icon,
      onClick: onToggleMessenger,
      enabled: () => true,
      active: () => false
    } : undefined
  ];

  function handleMarkdownDownload () {
    const text = docToMarkdown(documentUpdateModel.doc);
    downloadLink.current.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    downloadLink.current.click();
  }

  function handleIpfsImported () {
    setSnackbarMessage('Document loaded from IPFS!');
    setSnackbarOpen(true);
  }

  function handleIpfsUploaded (url) {
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
  }

  function handleEditorCreated (editor) {
    // Set peer name for status
    editor.sync.status.setUserName(username);

    onEditorCreated(editor);

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

  // When copy image from an http URL
  // async function imageSrcParser (imageSrc) {
  //   if (imageSrc.startsWith(config.ipfs.gateway)) return imageSrc;

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

      <a ref={downloadLink} download={`${title}.md`} style={{ display: 'none' }} />

      <DXOSEditor
        key={documentUpdateModel.doc.clientID}
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
