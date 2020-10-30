//
// Copyright 2020 DXOS.org
//

import { render, screen } from '@testing-library/react';
import React from 'react';

import Pad from '../src/components/Pad';

describe('dummy test', () => {
  it('Render Pad', () => {
    render(<Pad><span>TestPad</span></Pad>);
    expect(() => screen.getByText('TestPad')).not.toThrow();
  });
});
