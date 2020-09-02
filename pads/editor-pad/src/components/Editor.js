//
// Copyright 2020 DXOS.org
//

import React, { useCallback, useState, useEffect, useRef } from 'react';

import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import { Editor as DXOSEditor } from '@dxos/editor';
import MessengerPad from '@dxos/messenger-pad';
import { useProfile } from '@dxos/react-client';

import { useDataChannel } from '../data-channel';
import { docToMarkdown } from '../markdown';
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

export const Editor = ({ topic, itemId, title, pads = [], items = [], onCreateItem, onToggleMessenger = undefined }) => {
  const downloadLink = useRef();
  const classes = useEditorClasses();
  const [editor, setEditor] = useState();

  const { publicKey, username } = useProfile();
  const [statusData, broadcastStatus] = useDataChannel(itemId);

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
        onCreated={handleEditorCreated}
        reactElementRenderFn={handleReactElementRender}
        classes={classes}
        initialFontSize={14}
      />
    </>
  );
};
