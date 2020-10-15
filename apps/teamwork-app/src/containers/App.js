//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { keyToBuffer } from '@dxos/crypto';
import { AppContainer, usePads, useAppRouter, DefaultItemList } from '@dxos/react-appkit';
import { useItems } from '@dxos/react-client';

debug.enable('dxos:*');

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
  const items = useItems({ partyKey: keyToBuffer(topic), type: pads.map(pad => pad.type) });
  const item = items.find(i => i.id === itemId);
  // const { model } = useItems(topic);
  // const item = model.getById(itemId);
  // const client = useClient();
  // const [itemSettingsOpen, setItemSettingsOpen] = useState(false);

  // TODO(burdon): Create hook.
  // useEffect(() => {
  //   if (topic) {
  //     client.partyManager.openParty(keyToBuffer(topic)).then(noop);
  //   }
  // }, [topic]);

  // const listsModel = useModel({ model: ObjectModel, options: { type: [LIST_TYPE], topic, itemId } });

  // if (!model || !item || !pad) {
  //   return null;
  // }

  // const Settings = (pad && pad.settings) ? pad.settings : DefaultSettingsDialog;

  // if (pad.type === BOARD_TYPE) {
  //   if (!listsModel) {
  //     return null;
  //   }
  // }

  if (!item) return null;
  const pad = pads.find(pad => pad.type === item.type);

  return (
    <>
      <AppContainer
        // onSettingsOpened={() => setItemSettingsOpen(true)}
        sidebarContent={<DefaultItemList />}
        onHomeNavigation={() => router.push({ path: '/home' })}
      >
        <div className={classes.main}>
          {pad && <pad.main topic={topic} itemId={itemId} item={item} />}
        </div>
      </AppContainer>
      {/* <Settings
        topic={topic}
        open={itemSettingsOpen}
        onClose={() => setItemSettingsOpen(false)}
        onCancel={() => setItemSettingsOpen(false)}
        item={item}
        itemModel={model}
        Icon={pad && pad.icon}
        listsModel={listsModel}
      /> */}
    </>
  );
};

export default App;
