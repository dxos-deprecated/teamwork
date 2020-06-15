//
// Copyright 2020 Wireline, Inc.
//

import React, { useCallback, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';

import { Editor as DxOSEditor } from '@dxos/editor';

import { useProfile } from '@dxos/react-client';

import { useDocumentUpdateModel } from '../model';
import Pad from './Pad';

const useEditorClasses = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  editor: {
    '& reactelement': {
      display: 'inline-block'
    }
  }
}));

interface ContextMenuHandlersOptions {
  topic: string
  pads: any[]
  items: any[]
  onCreateItem: (type: string) => any
  editor: any
}

type ContextMenuItem = {
  id: string
  label: string
  create?: boolean
  fn: () => void
} | {
  subheader: string
}

const useContextMenuHandlers = ({ topic, pads, items, onCreateItem, editor }: ContextMenuHandlersOptions) => {
  const handleContextMenuGetOptions = useCallback(() => {
    let insertOptions: ContextMenuItem[] = items.map(item => ({
      id: item.id,
      label: item.title,
      fn: () => {
        editor.createReactElement({
          type: item.__type_url,
          itemId: item.id,
          title: item.title,
          topic
        });
      }
    }));

    if (insertOptions.length > 0) {
      insertOptions = [{ subheader: 'Insert items' }, ...insertOptions];
    }

    let createItemOptions: ContextMenuItem[] = pads.map(pad => ({
      id: `create-${pad.type}`,
      label: `New ${pad.displayName}`,
      create: true,
      fn: async () => {
        const item = await onCreateItem(pad.type);

        editor.createReactElement({
          type: pad.type,
          itemId: item.id,
          title: item.title,
          topic
        });
      }
    }));

    if (createItemOptions.length > 0) {
      createItemOptions = [{ subheader: 'Create items' }, ...createItemOptions];
    }

    return [...insertOptions, ...createItemOptions];
  }, [topic, pads, items, onCreateItem, editor]);

  const handleContextMenuRenderItem = useCallback(({ option }) => {
    return (
      <ListItemText
        primary={option.label}
      />
    );
  }, []);

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

export interface EditorProps {
  topic: string
  itemId: string
  pads: any[]
  items: any[]
  onCreateItem: (type: string) => any
}

export const Editor = (
  { topic, itemId, pads = [], items = [], onCreateItem }: EditorProps
) => {
  const { publicKey } = useProfile();
  const classes = useEditorClasses();
  const [editor, setEditor] = useState<any>();

  const documentUpdateModel = useDocumentUpdateModel(topic, itemId);

  useEffect(() => {
    if (!documentUpdateModel || !editor) return;

    // Remote updates handler: update current doc
    const modelUpdateHandler = (model: any, messages: any[]) => {
      messages.forEach(({ update, origin }) => {
        if (origin.docClientId !== editor.sync.doc.clientID) {
          editor.sync.processRemoteUpdate(update, origin);
        }
      });
    };

    // Apply initial messages
    documentUpdateModel.on('update', modelUpdateHandler);

    return () => {
      if (!editor) return;

      documentUpdateModel.off('update', modelUpdateHandler);

      editor.destroy();
    };
  }, [itemId, publicKey, editor, documentUpdateModel]);

  const handleLocalUpdate = useCallback((update, doc) => {
    documentUpdateModel.appendMessage({
      __type_url: 'testing.document.Update',
      update,
      origin: { author: publicKey, docClientId: doc.clientID }
    });
  }, [publicKey, documentUpdateModel]);

  const handleEditorCreated = useCallback(setEditor, [setEditor]);

  const handleReactElementRender = useCallback(props => {
    const { main: PadComponent, icon } = pads.find(pad => pad.type === props.type);

    return (
      <Pad title={props.title} icon={icon}>
        <PadComponent {...props} />
      </Pad>
    );
  }, [pads]);

  const {
    handleContextMenuGetOptions,
    handleContextMenuRenderItem,
    handleContextMenuOptionSelect
  } = useContextMenuHandlers({ topic, pads, items, onCreateItem, editor });

  const handleLocalStatusUpdate = () => null;

  if (!documentUpdateModel) return null;

  return (
    <DxOSEditor
      toolbar
      sync={{
        id: publicKey,
        onLocalUpdate: handleLocalUpdate,
        status: {
          onLocalUpdate: handleLocalStatusUpdate
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
    />
  );
};