//
// Copyright 2020 DxOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root';

import config from './config';

debug.enable(config.get('debug.logging'));

// TODO(burdon): Remove.
debug.enable('react-client:*,dxos:echo:*');

ReactDOM.render(<Root config={config.values} />, document.getElementById(config.get('app.rootElement')));
