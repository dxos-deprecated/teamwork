//
// Copyright 2020 DXOS.org
//

import React, { useCallback, useState } from 'react';

import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import { Editor as DXOSEditor } from '@dxos/editor';
import MessengerPad from '@dxos/messenger-pad';
import { useProfile } from '@dxos/react-client';

import { useDocumentUpdateModel } from '../model';
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
  const handleContextMenuGetOptions = useCallback(() => {
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

export const Editor = ({ party, topic, itemId, pads = [], items = [], onCreateItem, onToggleMessenger = undefined }) => {
  const { publicKey } = useProfile();
  const classes = useEditorClasses();
  const [editor, setEditor] = useState();

  const customButtons = onToggleMessenger ? [
    {
      name: 'messenger',
      title: 'Messenger',
      icon: MessengerPad.icon,
      onClick: onToggleMessenger,
      enabled: () => true,
      active: () => false
    }
  ] : [];

  const documentUpdateModel = useDocumentUpdateModel(topic, itemId);

  const handleEditorCreated = useCallback(setEditor, []);

  const handleReactElementRender = useCallback(props => {
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
  }, [pads]);

  const {
    handleContextMenuGetOptions,
    handleContextMenuRenderItem,
    handleContextMenuOptionSelect
  } = useContextMenuHandlers({ topic, pads, items, onCreateItem, editor });

  const handleLocalStatusUpdate = () => null;

  if (!documentUpdateModel) return null;

  return (
    <DXOSEditor
      key={documentUpdateModel.doc.clientID}
      toolbar={{ customButtons }}
      schema="full"
      sync={{
        id: publicKey,
        doc: documentUpdateModel.doc,
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
