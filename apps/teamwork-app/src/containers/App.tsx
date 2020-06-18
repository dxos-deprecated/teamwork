//
// Copyright 2020 DxOS, Inc.
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Home } from '@material-ui/icons';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer, usePads, useAppRouter } from '@dxos/react-appkit';
import { EditableText } from '@dxos/react-ux';

import { useViewList } from '../model';
import { Sidebar } from './Sidebar';
import { Pad } from '../common';

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
  const classes = useStyles();
  const { topic, item: viewId } = useParams();
  const client = useClient();
  const router = useAppRouter();

  const viewModel = useViewList(topic);
  const view = viewModel.getById(viewId);

  const [pads]: Pad[][] = usePads();
  const pad = view ? pads.find(pad => pad.type === view.__type_url) : undefined;

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  const appBarContent = (<>
    <IconButton aria-label="home" onClick={() => router.push({ path: '/landing' })} color="inherit">
      <Home />
    </IconButton>
    {view && (
      <EditableText
        value={view.title}
        variant="h6"
        classes={{ root: classes.titleRoot }}
        onUpdate={(title: string) => viewModel.editView(viewId, { title })}
      />
    )}
  </>);

  return (
    <AppContainer
      appBarContent={appBarContent}
      sidebarContent={<Sidebar />}
    >
      <div className={classes.main}>
        {pad && <pad.main topic={topic} viewId={viewId} />}
      </div>
    </AppContainer>
  );
};

export default App;
