#!/usr/bin/env bash

FLOW_STAGED=$(grep -e '.flowconfig$' <<< "$STAGED" || true)

if [ -n "$JS_STAGED" ] || [ -n "$FLOW_STAGED" ];
then
  npm run build
  npx flow
fi
