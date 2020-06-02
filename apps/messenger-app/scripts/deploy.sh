#!/bin/sh

# Ensure ~/.wireline/config.yml is set-up correctly.

set -x

yarn wire app build
yarn wire app publish
yarn wire app register

yarn wire app query --name DxOS.io/messenger

yarn run wire app serve --app wrn:app:DxOS.io/messenger --path /messenger --port 8080
