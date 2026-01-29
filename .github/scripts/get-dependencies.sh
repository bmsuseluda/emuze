#!/bin/sh

set -eu

ARCH=$(uname -m)

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

# Comment this out if you need an AUR package
#make-aur-package PACKAGENAME

# If the application needs to be manually built that has to be done down here

node -v
npm -v
npm install -g corepack
yarn -v
yarn
yarn app:distLinux --publish=never
yarn shrinkBundleSize

mkdir -p ./AppDir/bin
mkdir -p ./AppDir/share/emuze
mv -v  dist/squashfs-root/emulators ./AppDir/share/emuze
cp -v  dist/squashfs-root/emuze.png ./AppDir/.DirIcon
cp -v  dist/squashfs-root/emuze.desktop ./AppDir
cp -rv dist/squashfs-root/* ./AppDir/bin/
