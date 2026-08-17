#!/bin/sh

set -eu
ARCH=x86_64

echo "Installing package dependencies..."
echo "---------------------------------------------------------------"
pacman -Syu --noconfirm  \
            python       \
            nss          \
            at-spi2-core \
            nodejs-lts-jod \
            npm \

echo "Installing debloated packages..."
echo "---------------------------------------------------------------"
get-debloated-pkgs --add-common --prefer-nano

node -v
npm -v
npm install -g corepack
yarn -v

yarn
yarn app:distLinux

mv -v  dist/linux-unpacked/emulators ./AppDir
mv -v  dist/linux-unpacked/biosOpenSource ./AppDir
mv -v  dist/linux-unpacked/CHANGELOG.md ./AppDir
mv -v  dist/linux-unpacked/updater ./AppDir

cd dist && ./emuze-*.AppImage --appimage-extract && cd ..
cp  dist/squashfs-root/.DirIcon ./AppDir
cp  dist/squashfs-root/emuze.desktop ./AppDir

mkdir -p ./AppDir/bin
cp -rv dist/linux-unpacked/* ./AppDir/bin/