//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';

import { keyToBuffer } from '@dxos/crypto';
import MessengerPad from '@dxos/messenger-pad';
// import { usePads } from '@dxos/react-appkit';
import { useParty } from '@dxos/react-client';

import { Editor } from './components/Editor';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },

  container: {
    display: 'flex',
    flex: 1,
    [theme.breakpoints.up('subMbp')]: {
      margin: 'auto'
    },
    maxWidth: 800
  },

  messengerContainer: {
    width: 400
  }
}));

const EditorPad = ({ topic, item, itemId }) => {
  assert(topic);
  assert(itemId);

  const party = useParty(keyToBuffer(topic));
  const classes = useStyles();
  // const [pads] = usePads();
  // const { items, createItem } = useItems(topic, pads.map((pad) => pad.type));
  const [messengerOpen, setMessengerOpen] = useState(false);

  // const handleCreateItem = (type) => {
  //   return createItem(type);
  // };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Editor
          topic={topic}
          itemId={itemId}
          title={item.displayName}
          // pads={pads.filter(pad => pad.type !== TYPE_EDITOR_DOCUMENT)}
          // items={items.filter(item => item.type !== TYPE_EDITOR_DOCUMENT)}
          // onCreateItem={handleCreateItem}
          onToggleMessenger={() => setMessengerOpen(oldValue => !oldValue)}
        />
        {messengerOpen && (
          <div className={classes.messengerContainer}>
            <MessengerPad.main
              embedded
              party={party}
              topic={topic}
              itemId={itemId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPad;
