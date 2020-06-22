//
// Copyright 2020 DXOS.org
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

import { useItem } from '../model';
import { Sidebar } from './Sidebar';

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
  const [pads] = usePads();
  const [item, editItem] = useItem(topic, pads.map(pad => pad.type), viewId);
  const client = useClient();
  const router = useAppRouter();

  const pad = item ? pads.find(pad => pad.type === item.__type_url) : undefined;

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
    {item && (
      <EditableText
        value={item.title}
        variant="h6"
        classes={{ root: classes.titleRoot }}
        onUpdate={(title) => editItem(title)}
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
