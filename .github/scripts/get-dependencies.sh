#!/bin/sh

set -eu

ARCH=$(uname -m)

echo "Installing package dependencies..."
echo "---------------------------------------------------------------"
pacman -Syu --noconfirm  \
            python       \
            nss          \
            at-spi2-core \
          


echo "Installing debloated packages..."
echo "---------------------------------------------------------------"
get-debloated-pkgs --add-common --prefer-nano

# Comment this out if you need an AUR package
#make-aur-package PACKAGENAME

# If the application needs to be manually built that has to be done down here

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
          . "$HOME/.nvm/nvm.sh"
          export NVM_DIR="$HOME/.nvm"
          [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
          nvm install 22
          nvm use
          node -v
          npm -v
          npm install -g corepack
          yarn -v
          yarn
          yarn app:distLinux --publish=never
          yarn shrinkBundleSize

mkdir -p ./AppDir/bin
cp -rv dist/squashfs-root/* ./AppDir/bin/
cp -v  AppDir/bin/emuze.png ./AppDir/.DirIcon
cp -v  AppDir/bin/emuze.desktop ./AppDir
