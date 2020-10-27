//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';

import { keyToBuffer } from '@dxos/crypto';
import { usePads } from '@dxos/react-appkit';
import { useParty, useItems } from '@dxos/react-client';

import TasksPad from '@dxos/tasks-pad';
import MessengerPad from '@dxos/messenger-pad';
import PlannerPad from '@dxos/planner-pad';

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
  const [pads] = usePads();
  const items = useItems({ partyKey: keyToBuffer(topic), type: pads.map(pad => pad.type) });
  const [messengerOpen, setMessengerOpen] = useState(false);

  const handleCreateItem = async (type) => {
    const pad = pads.find(p => p.type === type);
    return await pad.create({ party }, {});
  };

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
