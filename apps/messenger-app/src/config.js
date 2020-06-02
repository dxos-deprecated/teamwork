//
// Copyright 2020 DxOS, Inc.
//

import { Config, LocalStorage, Dynamics, Envs, Defaults } from '@dxos/config';

// Generated by webpack-version-file-plugin.
// eslint-disable-next-line import/no-unresolved
import buildInfo from '../version.json';

/**
 * Constructs a global config based on the precendence of other configurations.
 * NOTE: We do not use environment variables.
 *
 * The order of precedence:
 * - Stored config (e.g., user configurable options).
 * - Build-target specific config (e.g., servers).
 * - App-specific defaults and constants.
 * - Build info (generated by webpack).
 *
 * TODO(burdon): Define global schema (across all apps/modules).
 * @returns {Object}
 */

const editableConfig = {
  editable: {
    app: false,
    client: {
      swarm: true
    }
  }
};

export const loadConfig = async () => new Config(
  LocalStorage(),
  await Dynamics(),
  await Envs(),
  Defaults(),
  editableConfig,
  buildInfo
);
