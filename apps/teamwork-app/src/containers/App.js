//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { useModel, useClient } from '@dxos/react-client';
import { ObjectModel } from '@dxos/echo-db';
import { LIST_TYPE, BOARD_TYPE } from '@dxos/planner-pad';
import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';

import { AppContainer, usePads, useAppRouter, DefaultViewList, useViews, DefaultSettingsDialog } from '@dxos/react-appkit';

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
  const { topic, item: viewId } = useParams();
  const [pads] = usePads();
  const { model } = useViews(topic);
  const item = model.getById(viewId);
  const client = useClient();
  const [viewSettingsOpen, setViewSettingsOpen] = useState(false);

  const pad = item ? pads.find(pad => pad.type === item.type) : undefined;

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  const listsModel = useModel({ model: ObjectModel, options: { type: [LIST_TYPE], topic, viewId } });

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
        sidebarContent={<DefaultViewList />}
        onSettingsOpened={() => setViewSettingsOpen(true)}
        onHomeNavigation={() => router.push({ path: '/home' })}
      >
        <div className={classes.main}>
          {pad && <pad.main topic={topic} viewId={viewId} />}
        </div>
      </AppContainer>
      <Settings
        topic={topic}
        open={viewSettingsOpen}
        onClose={() => setViewSettingsOpen(false)}
        onCancel={() => setViewSettingsOpen(false)}
        item={item}
        viewModel={model}
        Icon={pad && pad.icon}
        listsModel={listsModel}
      />
    </>
  );
};

export default App;
