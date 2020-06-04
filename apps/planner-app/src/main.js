//
// Copyright 2018 Wireline, Inc.
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root';

import config from './config';

debug.enable(config.get('debug.logging'));

ReactDOM.render(<Root config={config.values} />, document.getElementById(config.get('app.rootElement')));
