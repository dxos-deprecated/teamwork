//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';

import { keyToBuffer } from '@dxos/crypto';
import MessengerPad from '@dxos/messenger-pad';
import PlannerPad from '@dxos/planner-pad';
import { usePads } from '@dxos/react-appkit';
import { useParty, useItems } from '@dxos/react-client';
import TasksPad from '@dxos/tasks-pad';

import { Editor } from './components/Editor';
import { EDITOR_TYPE_DOCUMENT } from './model';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: 'auto'
  },

  container: {
    display: 'flex',
    flex: 1,
    [theme.breakpoints?.up('subMbp')]: {
      margin: 'auto'
    },
    maxWidth: 800,
    width: 800
  },

  messengerContainer: {
    width: 400
  }
}));

const EditorPad = ({ topic, itemId }) => {
  assert(topic);
  assert(itemId);

  const party = useParty(keyToBuffer(topic));
  const classes = useStyles();
  const [pads] = usePads();
  const [item] = useItems({ partyKey: party.key, type: EDITOR_TYPE_DOCUMENT, id: itemId });
  const items = useItems({ partyKey: keyToBuffer(topic), type: pads.map(pad => pad.type) });
  const [messengerOpen, setMessengerOpen] = useState(false);

  const handleCreateItem = async (type) => {
    const pad = pads.find(p => p.type === type);
    return await pad.create({ party }, {});
  };

  if (!item) {
    return null;
  }

  const embeddablePads = [PlannerPad.type, TasksPad.type, MessengerPad.type];

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Editor
          topic={topic}
          itemId={itemId}
          title={item.displayName}
          pads={pads.filter(pad => embeddablePads.includes(pad.type))}
          items={items.filter(item => embeddablePads.includes(item.type))}
          onCreateItem={handleCreateItem}
          onToggleMessenger={() => setMessengerOpen(oldValue => !oldValue)}
        />

        {/* TODO(burdon): Factor out. */}
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
