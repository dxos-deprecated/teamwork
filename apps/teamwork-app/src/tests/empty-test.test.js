//
// Copyright 2020 DXOS.org
//
import { render } from '@testing-library/react';
import React from 'react';

import Pad from '../../../../pads/editor-pad/src/components/Pad';

describe('Simple test to check jest coverage action', () => {
    test('Render pad', async () => {
        render(<Pad />);
    });
});
