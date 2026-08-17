#!/bin/sh

set -eu

ARCH=x86_64
VERSION=$(node -p "require('./package.json').version")
export ARCH VERSION
export OUTPATH=./dist
export UPINFO="gh-releases-zsync|${GITHUB_REPOSITORY%/*}|${GITHUB_REPOSITORY#*/}|latest|*.AppImage.zsync"

yarn shrinkBundleSize

# Deploy dependencies
quick-sharun ./AppDir/bin/*  

# Turn AppDir into AppImage
quick-sharun --make-appimage