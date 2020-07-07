//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { AppKitContextProvider } from '@dxos/react-appkit';

import MemberAvatar from '../src/components/MemberAvatar';
import MessengerPad from '@dxos/messenger-pad';
import EditorPad from '@dxos/editor-pad';
import PlannerPad from '@dxos/planner-pad';
import CanvasApp from '@dxos/canvas-pad';
import TestingPad from '@dxos/testing-pad';

export default {
  title: 'Pad Icon'
};

export const withPadIcon = () => {
  const pads = [
    MessengerPad,
    EditorPad,
    PlannerPad,
    CanvasApp,
    TestingPad
  ];

  return (
    <AppKitContextProvider
      pads={pads}
    >
      <MemberAvatar type={'editorPad'} />
    </AppKitContextProvider>
  );
};
