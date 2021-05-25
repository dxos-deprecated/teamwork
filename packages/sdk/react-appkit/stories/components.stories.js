//
// Copyright 2020 DXOS.org
//

import React, { useRef, useState, useEffect } from 'react';

import Box from '@material-ui/core/Box';
import DebugIcon from '@material-ui/icons/BugReport';
import ConnectedIcon from '@material-ui/icons/Wifi';

import { createKeyPair, PublicKey } from '@dxos/crypto';
import { OpenProgress } from '@dxos/echo-db';

import { MemberAvatar, useAssets, StatusBar, NewItemCreationMenu, InitializeLoader } from '../src';
import { pads } from './common';

export default {
  title: 'Components'
};

export const withMemberAvatar = () => {
  const member = {
    publicKey: PublicKey.from(createKeyPair().publicKey),
    displayName: 'Test name'
  };

  return (
    <Box m={2}>
      <MemberAvatar member={member} />
    </Box>
  );
};

export const withNoDisplayName = () => {
  const member = {
    publicKey: PublicKey.from(createKeyPair().publicKey),
    displayName: undefined
  };

  return (
    <Box m={2}>
      <MemberAvatar member={member} />
    </Box>
  );
};

export const withImages = () => {
  const assets = useAssets();

  return (
    <Box m={2}>
      <img src={assets.getThumbnail(PublicKey.from(createKeyPair().publicKey).toString())} />
    </Box>
  );
};

export const withStatusBar = () => {
  const actions = [
    {
      isActive: () => false,
      handler: () => null,
      title: 'Mock debug',
      Icon: DebugIcon
    }
  ];

  const indicators = [
    {
      isActive: () => false,
      Icon: ConnectedIcon
    }
  ];

  return (
    <Box m={2}>
      <StatusBar
        actions={actions}
        indicators={indicators}
        meta='A storybook statusbar'
      />
    </Box>
  );
};

export const withNewItemCreationMenu = () => {
  const anchorEl = useRef();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => setInitialized(!!anchorEl.current), [anchorEl]);

  return (
    <Box m={2}>
      <div ref={anchorEl} />
      {initialized && (
        <NewItemCreationMenu
          open
          onClose={() => null}
          onSelect={() => null}
          pads={pads}
          anchorEl={anchorEl.current}
        />
      )}
    </Box>
  );
};

// TODO(burdon): Factor out.
const useAsyncReference = (value) => {
  const ref = useRef(value);
  const [, forceRender] = useState(false);

  function updateState(newState) {
    ref.current = newState;
    forceRender(s => !s);
  }

  return [ref, updateState];
};

export const withInitializeLoader = () => {
  const [value, setValue] = useAsyncReference(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(value.current + Math.random() * 10);
      if (value.current >= 100) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <InitializeLoader value={value.current} />
  );
};
