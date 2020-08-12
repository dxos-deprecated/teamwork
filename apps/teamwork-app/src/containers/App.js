//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { ObjectModel } from '@dxos/echo-db';
import { LIST_TYPE, BOARD_TYPE } from '@dxos/planner-pad';
import { AppContainer, usePads, useAppRouter, DefaultItemsList, useItems, DefaultSettingsDialog } from '@dxos/react-appkit';
import { useModel, useClient } from '@dxos/react-client';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },

  titleRoot: {
    color: theme.palette.primary.contrastText,
    display: 'inline-block',
    lineHeight: '48px'
  }
}));

const App = () => {
  const router = useAppRouter();
  const classes = useStyles();
  const { topic, item: itemId } = useParams();
  const [pads] = usePads();
  const { model } = useItems(topic);
  const item = model.getById(itemId);
  const client = useClient();
  const [itemSettingsOpen, setItemSettingsOpen] = useState(false);

  const pad = item ? pads.find(pad => pad.type === item.type) : undefined;

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  const listsModel = useModel({ model: ObjectModel, options: { type: [LIST_TYPE], topic, itemId } });

  if (!model || !item || !pad) {
    return null;
  }

  const Settings = (pad && pad.settings) ? pad.settings : DefaultSettingsDialog;

  if (pad.type === BOARD_TYPE) {
    if (!listsModel) {
      return null;
    }
  }

  return (
    <>
      <AppContainer
        onSettingsOpened={() => setItemSettingsOpen(true)}
        sidebarContent={<DefaultItemsList />}
        onHomeNavigation={() => router.push({ path: '/home' })}
      >
        <div className={classes.main}>
          {pad && <pad.main topic={topic} itemId={itemId} />}
        </div>
      </AppContainer>
      <Settings
        topic={topic}
        open={itemSettingsOpen}
        onClose={() => setItemSettingsOpen(false)}
        onCancel={() => setItemSettingsOpen(false)}
        item={item}
        itemModel={model}
        Icon={pad && pad.icon}
        listsModel={listsModel}
      />
    </>
  );
};

export default App;
