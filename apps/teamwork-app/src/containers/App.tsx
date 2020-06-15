//
// Copyright 2020 DxOS, Inc.
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer, usePads } from '@dxos/react-appkit';
import { EditableText } from '@dxos/react-ux';

import { useItem } from '../model';
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
    color: theme.palette.primary.contrastText
  }
}));

const App = () => {
  const classes = useStyles();
  const { topic, item: itemId } = useParams();
  const [pads]: Pad[][] = usePads();
  const [item, editItem] = useItem(topic, pads.map(pad => pad.type), itemId);
  const client = useClient();

  const pad = item ? pads.find(pad => pad.type === item.__type_url) : undefined;

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  return (
    <AppContainer
      appBarContent={item && (
        <EditableText
          value={item.title}
          variant="h6"
          classes={{ root: classes.titleRoot }}
          onUpdate={(title: string) => editItem({ title })}
        />
      )}
      sidebarContent={<Sidebar />}
    >
      <div className={classes.main}>
        {pad && <pad.main topic={topic} itemId={itemId} />}
      </div>
    </AppContainer>
  );
};

export default App;
