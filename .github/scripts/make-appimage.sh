#!/bin/sh

set -eu

VERSION=$(node -p "require('./package.json').version")

export VERSION
export OUTNAME=emuze-"$VERSION".AppImage
export OUTPATH=./dist
export UPINFO="gh-releases-zsync|${GITHUB_REPOSITORY%/*}|${GITHUB_REPOSITORY#*/}|latest|*.AppImage.zsync"

# Deploy dependencies
quick-sharun ./AppDir/bin/*  

# Turn AppDir into AppImage
ADD_PERMA_ENV_VARS="REUSE_CHECK_DELAY=0" quick-sharun --make-appimage

# Test the app for 12 seconds, if the test fails due to the app
# having issues running in the CI use --simple-test instead
quick-sharun --test ./dist/*.AppImage