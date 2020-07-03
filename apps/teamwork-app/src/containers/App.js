//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { noop } from '@dxos/async';
import { keyToBuffer, verify, SIGNATURE_LENGTH } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer, usePads } from '@dxos/react-appkit';
import { EditableText } from '@dxos/react-ux';
import { BotFactoryClient } from '@dxos/botkit-client';

import { useItems } from '../model';
import { Sidebar } from './Sidebar';
import BotInviteDialog from '../components/BotInviteDialog';

const sleep = ms => {
  let cancel;
  const promise = new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    cancel = err => {
      clearTimeout(timeout);
      reject(err);
    };
  });

  return { promise, cancel };
};

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
  const model = useItems(topic);
  const item = model.getById(viewId);
  const client = useClient();

  const pad = item ? pads.find(pad => pad.type === item.type) : undefined;
  const [botDialogVisible, setBotDialogVisible] = useState(false);

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  const handleBotInvite = async (botFactoryTopic, bot, botVersion, spec) => {
    const botId = `wrn:bot:${bot}#${botVersion}`;

    const botFactoryClient = new BotFactoryClient(client.networkManager, botFactoryTopic);

    const secretProvider = () => {
    };

    // Provided by inviter node.
    const secretValidator = async (invitation, secret) => {
      const signature = secret.slice(0, SIGNATURE_LENGTH);
      const message = secret.slice(SIGNATURE_LENGTH);
      return verify(message, signature, keyToBuffer(botFactoryTopic));
    };

    const invitation = await client.partyManager.inviteToParty(
      keyToBuffer(topic),
      secretValidator,
      secretProvider,
      {
        onFinish: () => {
          botFactoryClient.close();
          setBotDialogVisible(false);
        }
      }
    );

    const botUID = await botFactoryClient.sendSpawnRequest(botId);
    await sleep(10000);
    await botFactoryClient.sendInvitationRequest(botUID, topic, spec, invitation.toQueryParameters());
  };

  const appBarContent = (<>
    {item && (
      <EditableText
        value={item.displayName}
        variant="h6"
        classes={{ root: classes.titleRoot }}
        onUpdate={(title) => model.renameView(viewId, title)}
      />
    )}
    <button onClick={() => setBotDialogVisible(true)}>Invite bot</button>
    <BotInviteDialog
      open={botDialogVisible}
      onSubmit={({ topic: bfTopic, bot, botVersion, spec }) => handleBotInvite(bfTopic, bot, botVersion, spec)}
      onClose={() => setBotDialogVisible(false)}
    />
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
