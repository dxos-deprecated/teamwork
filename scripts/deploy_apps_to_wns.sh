#!/bin/bash

set -euo pipefail

for app in `find . -name 'app.yml'`; do
  pushd `dirname $app`

  ORG="dxos.network"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2-`
  PKG_DESC=`cat package.json | jq -r '.description'`
  PKG_VERSION=`cat package.json | jq -r '.version'`
  
  if [ -z "$PKG_DESC" ]; then
    PKG_DESC="$PKG_NAME"
  fi
  
  WNS_NAME="$ORG/$PKG_NAME"
  WNS_VERSION=`yarn -s wire app query --name "$WNS_NAME" | jq -r '.[0].version'`
  
  if [ -z "$WNS_VERSION" ]; then
    WNS_VERSION="0.0.0"
  fi
  
  cat <<EOF > app.yml
name: $WNS_NAME
displayName: $PKG_DESC
build: yarn dist
version: $WNS_VERSION
EOF
  
  yarn -s wire app deploy

  popd
done