#!/bin/sh

set -eu

ARCH=$(uname -m)
VERSION="nightly"
export ARCH VERSION
export OUTPATH=./dist
export ADD_HOOKS="self-updater.bg.hook"
export UPINFO="gh-releases-zsync|${GITHUB_REPOSITORY%/*}|${GITHUB_REPOSITORY#*/}|latest|*$ARCH.AppImage.zsync"

# Deploy dependencies
quick-sharun ./AppDir/bin/*  

# Turn AppDir into AppImage
quick-sharun --make-appimage