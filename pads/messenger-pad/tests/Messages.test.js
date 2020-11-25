//
// Copyright 2020 DXOS.org
//

import { render, screen } from '@testing-library/react';
import React from 'react';

import Messages from '../src/components/Messages';

describe('Test Messages', () => {
  const messages = [
    { id: '1', timestamp: '1', text: 'Message text 1', sender: 'userA' },
    { id: '2', timestamp: '2', text: 'Message text 2', sender: 'userB' },
    { id: '3', timestamp: '3', text: 'Message text 3', sender: 'userA' }
  ];

  it('Render Messages', () => {
    expect(() => render(<Messages messages={messages}></Messages>)).not.toThrow();
    expect(() => screen.getByText(messages[0].text)).not.toThrow();
    expect(() => screen.getByText(messages[1].text)).not.toThrow();
    expect(() => screen.getByText(messages[2].text)).not.toThrow();
  });
});
