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
./dist/emuze-*.AppImage --appimage-extract

mkdir -p ./AppDir/bin
mv -v  dist/squashfs-root/emulators ./AppDir
mv -v  dist/squashfs-root/biosOpenSource ./AppDir
mv -v  dist/squashfs-root/CHANGELOG.md ./AppDir
mv -v  dist/squashfs-root/updater ./AppDir
mv -v  dist/squashfs-root/updater ./AppDir
mv -v  dist/squashfs-root/.DirIcon ./AppDir
mv -v  dist/squashfs-root/emuze.desktop ./AppDir
cp -rv dist/squashfs-root/* ./AppDir/bin/