#!/usr/bin/env bash

set -e

if [ -n "$JS_STAGED" ] || [ -n "$SNAPSHOT_STAGED" ];
then
  npm run test -s
fi
