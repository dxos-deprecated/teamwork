//
// Copyright 2020 DxOS, Inc.
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chance } from 'chance';

import { makeStyles } from '@material-ui/core/styles';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer, usePads } from '@dxos/react-appkit';
import { EditableText } from '@dxos/react-ux';

import { useItem, useItemList } from '../model';
import { Sidebar } from './Sidebar';
import { Pad } from '../common';

const chance = new Chance();

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
  const { items, createItem } = useItemList(topic, pads.map(pad => pad.type));
  const [item, editItem] = useItem(topic, pads.map(pad => pad.type), itemId);
  const client = useClient();

  const pad = item ? pads.find(pad => pad.type === item.__type_url) : undefined;

  const handleCreate = (type: string) => {
    const title = `item-${chance.word()}`;
    const itemId = createItem({ __type_url: type, title });
    return { __type_url: type, itemId, title };
  };

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
        {pad && (
          <pad.main
            topic={topic}
            itemId={itemId}
            pads={pads}
            items={items}
            onCreateItem={handleCreate}
          />
        )}
      </div>
    </AppContainer>
  );
};

export default App;
