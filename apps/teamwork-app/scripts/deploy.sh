#!/bin/sh

# Ensure ~/.wireline/config.yml is set-up correctly.

set -x

yarn wire app build
yarn wire app publish
yarn wire app register

yarn wire app query --name DXOS.io/teamwork

yarn run wire app serve --app wrn:app:DXOS.io/teamwork --path /teamwork --port 8080
