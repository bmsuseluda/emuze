#!/bin/sh

set -eu

echo "Installing debloated packages..."
echo "---------------------------------------------------------------"
get-debloated-pkgs --add-common --prefer-nano

yarn
yarn app:dirLinux
yarn shrinkBundleSize

mkdir -p ./AppDir/bin
mv -v  dist/linux-unpacked/emulators ./AppDir
mv -v  dist/linux-unpacked/biosOpenSource ./AppDir
mv -v  dist/linux-unpacked/CHANGELOG.md ./AppDir
mv -v  dist/linux-unpacked/updater ./AppDir

cp -v  .github/scripts/.DirIcon ./AppDir
cp -v  .github/scripts/emuze.desktop ./AppDir

cp -rv dist/linux-unpacked/* ./AppDir/bin/