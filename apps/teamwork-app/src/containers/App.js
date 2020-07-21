//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Home } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer, usePads, useAppRouter, DefaultViewSidebar, useViews, ViewSettingsDialog, DefaultSettingsDialog } from '@dxos/react-appkit';

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

  if (!model || !item) {
    return <p>Loading...</p>;
  }

  const Settings = (pad && pad.settings) ? pad.settings : DefaultSettingsDialog;

  return (
    <>
      <AppContainer
        sidebarContent={<DefaultViewSidebar />}
        onSettingsOpened={() => setViewSettingsOpen(true)}
        onHomeNavigation={() => router.push({ path: '/home' })}
      >
        <div className={classes.main}>
          {pad && <pad.main topic={topic} viewId={viewId} viewSettingsOpen={viewSettingsOpen} setViewSettingsOpen={setViewSettingsOpen} />}
        </div>
      </AppContainer>
      {/* {pad && !pad.customViewSettings && (
        <ViewSettingsDialog
          open={viewSettingsOpen}
          onClose={() => setViewSettingsOpen(false)}
          viewModel={model}
          pads={pads}
          viewId={viewId}
        />
      )} */}
      <Settings
        open={viewSettingsOpen}
        onClose={() => setViewSettingsOpen(false)}
        onCancel={() => setViewSettingsOpen(false)}
        item={item}
        viewModel={model}
      />
    </>
  );
};

export default App;
