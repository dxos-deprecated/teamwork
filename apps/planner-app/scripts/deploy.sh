#!/bin/sh

# Ensure ~/.wireline/config.yml is set-up correctly.

set -x

yarn wire app build
yarn wire app publish
yarn wire app register

yarn wire app query --name wireline.io/planner

yarn run wire app serve --app wrn:app:wireline.io/planner --path /planner --port 8080
