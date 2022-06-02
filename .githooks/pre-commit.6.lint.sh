#!/usr/bin/env bash

if [ -n "$JS_STAGED" ];
then
  npx eslint $JS_STAGED
  npx documentation lint 'src/**/*.(ts|js|tsx)'
fi
