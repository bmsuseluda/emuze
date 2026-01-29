#!/bin/sh

set -eu

ARCH=$(uname -m)
VERSION="${VERSION:-beta-0.1}"
export ARCH VERSION
export OUTPATH=./dist
export ADD_HOOKS="self-updater.bg.hook:fix-namespaces.hook"
export UPINFO="gh-releases-zsync|${GITHUB_REPOSITORY%/*}|${GITHUB_REPOSITORY#*/}|latest|*$ARCH.AppImage.zsync"
export ANYLINUX_LIB=1

# Deploy dependencies
quick-sharun \
             ./AppDir/bin/*  
             
# Additional changes can be done in between here

# Turn AppDir into AppImage
quick-sharun --make-appimage