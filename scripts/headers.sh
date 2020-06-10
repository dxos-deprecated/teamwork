#!/bin/zsh
set +e
setopt NULL_GLOB;
unsetopt nomatch;
exit_code=0

cd ../

for file in {apps,pads,bots}/**/src/**/*.{js,ts,jsx,tsx}; do
  echo $file | grep -q 'node_modules/' && continue
  echo $file | grep -q 'dist/' && continue
  echo $file | grep -q 'build/' && continue
  echo $file | grep -q '.config.js' && continue
  if grep -q 'Copyright [0-9][0-9][0-9][0-9] [a-zA-Z]*, Inc.' $file
  then
    : # file has header
  else
    echo "$file is missing the header";
    exit_code=1
    [ -n "$CI" ] && continue # no changes on CI
    echo -e "//\n" | cat - "$file" > /tmp/out_file && mv /tmp/out_file "$file"
    echo "// Copyright 2020 DxOS, Inc." | cat - "$file" > /tmp/out_file && mv /tmp/out_file "$file"
    echo "//" | cat - "$file" > /tmp/out_file && mv /tmp/out_file "$file"
  fi
done

exit $exit_code
