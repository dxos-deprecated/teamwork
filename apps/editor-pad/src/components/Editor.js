//
// Copyright 2020 Wireline, Inc.
//

import React, { Fragment, useState, useCallback, useEffect, useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';

import { createId } from '@dxos/crypto';

import { Editor, Channel } from '@dxos/editor';

import { useDocumentUpdateModel } from '../model';

import {
  PadNodeView,
  createPadNodeView,
  padSchemaEnhancer,
  createPadNode
} from '../lib/prosemirror-pad-view';

import EmbeddedPads from './EmbeddedPads';

const useEditorClasses = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  editor: {
    '& pad.pad': {
      display: 'inline-block'
    }
  }
}));

const EditorComponent = ({
  topic,
  itemId,
  userId,
  statusChannel,
  nodeViews,
  pads,
  items,
  onCreateItem
}) => {
  const classes = useEditorClasses();
  const editor = useRef(null);
  const documentUpdateModel = useDocumentUpdateModel(topic, itemId);
  const [document, setDocument] = useState(documentUpdateModel?.document);

  useEffect(() => {
    if (!documentUpdateModel) return;

    setDocument(documentUpdateModel.document);

    if (editor.current) {
      editor.current.reset();
    }

    return () => {
      if (!editor.current) return;
      editor.current.destroy();
    };
  }, [documentUpdateModel]);

  const handleContextMenuGetOptions = useCallback(() => {
    let insertOptions = items.map(item => ({
      id: item.id,
      label: item.title,
      fn: view => {
        const { tr, selection, schema } = view.state;
        selection.replaceWith(tr, createPadNode(schema, {
          type: item.__type_url,
          itemId: item.id,
          title: item.title,
          topic
        }));
        view.dispatch(tr);
      }
    }));

    if (insertOptions.length > 0) {
      insertOptions = [{ subheader: 'Insert items' }, ...insertOptions];
    }

    let createItemOptions = pads.map(pad => ({
      id: `create-${pad.type}`,
      label: `New ${pad.displayName}`,
      create: true,
      fn: async view => {
        const { tr, selection, schema } = view.state;

        const item = await onCreateItem(pad.type);
        selection.replaceWith(tr, createPadNode(schema, {
          type: pad.type,
          itemId: item.id,
          title: item.title,
          topic
        }));
        view.dispatch(tr);
      }
    }));

    if (createItemOptions.length > 0) {
      createItemOptions = [{ subheader: 'Create items' }, ...createItemOptions];
    }

    return [...insertOptions, ...createItemOptions];
  }, [topic, pads, items, onCreateItem]);

  const handleContextMenuRenderItem = useCallback(({ option }) => {
    return (
      <ListItemText
        primary={option.label}
      />
    );
  }, []);

  const handleContextMenuOptionSelect = useCallback((option, view) => {
    if (option.fn) {
      return option.fn(view);
    }
  }, []);

  const handleEditorCreated = useCallback(editorInstance => {
    editor.current = editorInstance;
  }, []);

  if (!document) return null;

  return (
    <Editor
      toolbar
      sync={{
        id: userId,
        document,
        status: {
          getUsername: () => userId.toString(),
          channel: statusChannel
        }
      }}
      contextMenu={{
        getOptions: handleContextMenuGetOptions,
        onSelect: handleContextMenuOptionSelect,
        renderItem: handleContextMenuRenderItem
      }}
      schemaEnhancers={[padSchemaEnhancer]}
      nodeViews={nodeViews}
      onCreated={handleEditorCreated}
      classes={classes}
    />
  );
};

const EditorContainer = ({ topic, itemId, pads = [], items = [], onCreateItem }) => {
  const [id] = useState(createId());
  const [statusChannel] = useState(new Channel());
  const [embeddedPads, setEmbeddedPads] = useState([]);

  const handleRenderPadNodeView = useCallback(node => {
    const padNodeView = new PadNodeView(node);

    setEmbeddedPads(embeddedPads => ([
      ...embeddedPads,
      {
        domNode: padNodeView.dom,
        node: padNodeView.node
      }
    ]));

    return padNodeView;
  }, []);

  return (
    <Fragment>
      <EmbeddedPads embeddedPads={embeddedPads} pads={pads} />
      <EditorComponent
        topic={topic}
        itemId={itemId}
        userId={id}
        statusChannel={statusChannel}
        nodeViews={createPadNodeView(handleRenderPadNodeView)}
        pads={pads}
        items={items}
        onCreateItem={onCreateItem}
      />
    </Fragment>
  );
};

export default EditorContainer;
