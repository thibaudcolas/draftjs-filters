#!/usr/bin/env bash

TS_STAGED=$(grep 'tsconfig.json' <<< "$STAGED" || true)

if [ -n "$JS_STAGED" ] || [ -n "$TS_STAGED" ];
then
  npm run build
fi
