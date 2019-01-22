#!/usr/bin/env bash

if [ -n "$JS_STAGED" ];
then
  npx eslint $JS_STAGED
  npx documentation lint $JS_STAGED
fi
