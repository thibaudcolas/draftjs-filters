#!/usr/bin/env bash

set -e

if [ -n "$JS_STAGED" ] || [ -n "$SNAPSHOT_STAGED" ];
then
  DRAFTJS_VERSION=0.10.5 npm run test -s
  DRAFTJS_VERSION=0.11.2 npm run test -s
fi
