//
// Copyright 2020 DxOS.org
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer } from '@dxos/react-appkit';
import { EditableText } from '@dxos/react-ux';

import { useDocumentMetadata } from '../model';
import Canvas from './Canvas';
import Sidebar from './Sidebar';

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
  const { topic, item: documentId } = useParams();
  const [document, updateDocument] = useDocumentMetadata(topic, documentId);
  const client = useClient();

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  return (
    <AppContainer
      appBarContent={document && (
        <EditableText
          value={document.title}
          variant="h6"
          classes={{ root: classes.titleRoot }}
          onUpdate={title => updateDocument({ title })}
        />
      )}
      sidebarContent={<Sidebar topic={topic} />}
    >
      <div className={classes.main}>
        {documentId && <Canvas />}
      </div>
    </AppContainer>
  );
};

export default App;