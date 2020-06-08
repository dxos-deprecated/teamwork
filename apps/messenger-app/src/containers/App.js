//
// Copyright 2020 DxOS, Inc.
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer } from '@dxos/react-appkit';
import { EditableText } from '@dxos/react-ux';
import MessengerPad from '@dxos/messenger-pad';
import { useItem } from '../model';

import Sidebar from './Sidebar';

const pads = [
  MessengerPad,
];

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
  const [item, editItem] = useItem(topic, pads.map(pad => pad.type), itemId);
  const client = useClient();

  const pad = pads.find(pad => pad.type === item.__type_url);

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
          onUpdate={title => editItem({ title })}
        />
      )}
      sidebarContent={<Sidebar topic={topic} pads={pads} />}
    >
      <div className={classes.main}>
        {/* eslint-disable-next-line react/jsx-pascal-case */}
        {pad && <pad.main />}
      </div>
    </AppContainer>
  );
};

export default App;
