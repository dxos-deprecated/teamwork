#!/bin/sh

# Ensure ~/.dxos/config.yml is set-up correctly.

set -x

yarn dx app build
yarn dx app publish
yarn dx app register

yarn dx app query --name DXOS.io/teamwork

yarn run dx app serve --app wrn:app:DXOS.io/teamwork --path /teamwork --port 8080
