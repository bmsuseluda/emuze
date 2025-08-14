# Changelog

## 0.56.0

This release is all about gamepad controls. In the past i used the Web Gamepad Api to provide



26 of the 33 supported systems are pre configured and 23 of them are bundled now🥳

Please let me know what you think of it in the [emuze discord](https://discord.gg/tCzK7kc6Y4).

### 💥 Features
- fully reworked gamepad integration in emuze (Replaced Web Gamepad Api with [SDL](https://github.com/kmamal/node-sdl))
- pre configure RPCS3
- map keyboard if no controller is connected on RPCS3
- pre configure PPSSPP
- map keyboard if no controller is connected on PPSSPP
- to play docked with your Steam Deck the Steam Deck Controls will be configured as the last controller in all pre configured emulators
- buttons on Nintendo controllers in emuze are now switched, so `a` confirms and triggers an action and `b` cancels  and goes back
  - therefore closing a game with a nintendo gamepad will be done with `select + a`
- set ares as the default emulator for PC Engine SuperGrafx

### 💫 Updates / Bundles
- bundle RPCS3 v0.0.37
- bundle PPSSPP v1.19.3
- update bundled Ryujinx to v1.3.2
- update bundled PCSX2 to v2.4.0
- update bundled Azahar to v2122.1
- update bundled Dolphin to v2506a
- update bundled ares to v145

### 🪲 Bug Fixes
- Switch Joy-Cons did not work in emuze
- Switch  Pro controllers did not work in emuze
- NSO NES controllers did not work in emuze
- NSO SNES controllers did not work in emuze
- Gamecube controllers with a wiiu/switch adapter did not work in emuze
- dinput controllers did not work anymore after closing game on windows
- xinput controllers could not close a game on windows
- closing the file dialog with keyboard `escape` was closing the settings dialog too
- sometimes keyboard `enter` launched the emulator multiple times
- Sony PlayStation controllers will be recognized with the correct buttons glyphs even if Steam Input is active
- fixed endless loop in game dialog if an error happend
- fixed controller mapping for Dolphin on non Steam OS Linux Distributions
- fixed controller mapping for Ryujinx if there are several controller of the same type e.g. 2x dualshock 3
- fixed controller mapping for Dolphin if there are several controller of the same type e.g. 2x dualshock 3
- fixed controller mapping for Ryujinx if Steam Input is active
- gamepath was not set correctly for Dolphin
- fixed NSO NES controller mapping for ares
- fixed NSO N64 controller mapping for ares
- last played after changing games path showed games that were not there anymore
- changing games path could lead to broken gamepad controls
- empty system folder created an unusable system in emuze

### 🐞 Open Bugs
- Updater does not work on Steam Deck Game Mode -> Please switch to Desktop for updating emuze
- dinput controllers are not mapped correctly on mednafen

## 0.55.0

Finally this release is done. It went quite longer then i expected. I had to do a lot under the hood with some major version jumps of the libraries i use that lead to bigger refactorings.

With the downfall of citra the future of 3DS emulation was uncertain at best, but not long after 2 citra forks raised from the ashes: Lime3DS with a focus of UI- and quality of life changes and PabloMK7s Citra with a focus of accurate emulation. Both projects merged now into Azahar so it was time to replace Lime3DS with Azahar, bundle and pre configure it in emuze.

Next to Azahar i bundled and preconfigured PCSX2.
24 of the 33 supported systems are pre configured and 20 of them are bundled now🥳

Besides this and a lot of bug fixes i did some quality of life changes. You can now close a game with the controller and emuze all together. Also there is an "About" Page in the settings Overlay where you can find links to the github, discord and changelog.

Please let me know what you think of it in the [emuze discord](https://discord.gg/tCzK7kc6Y4).

### 💥 Features
- set Azahar as the default emulator for 3DS. You can switch back to Lime3DS with the command line option `--lime3ds` if you are facing some issues
- pre configure Azahar
- add about page
- close game via
  - Xbox: `back + a`
  - PlayStation: `select + x`
  - Nintendo: `select + b`
- map keyboard if no controller is connected on DuckStation
- map keyboard if no controller is connected on PCSX2
- map keyboard if no controller is connected on Dolphin
- align with XDG specification. Old settings will be migrated automatically
- add confirmation dialog to close emuze with a gamepad

### 💫 Updates / Bundles
- bundle Azahar v2121.2
- bundle PCSX2 v2.2.0
- update bundled Ryujinx to v1.3.1
- update bundled ares to v144

### 🪲 Bug Fixes
- disable auto update of bundled emulators
- disable wizards of bundled emulators
- Missing graphical Elements with Dolphin on Fedora: A big thank you to [samueru-sama](https://github.com/Samueru-sama) for fixing [this](https://github.com/pkgforge-dev/Dolphin-emu-AppImage/issues/20)
- ares wasn't working on older linux distributions: A big thank you to [samueru-sama](https://github.com/Samueru-sama) for upgrading the Tech Stack of the [ares AppImage](https://github.com/pkgforge-dev/ares-emu-appimage/pull/2)
- emuze on first start could not be closed, if not configured
- `--no-sandbox` is not necessary anymore if emuze is used as a non steam game (Steam Deck Game Mode)
- fix fullscreen for mame
- sometimes gamepads were not be recognized on windows
- fix closing game version dialog on last played page
- fix ryujinx freezing with dinput gamepads
- fix mednafen gamepad mapping on windows with xinput gamepads
- fix removing of old gamepad configurations for ares and mednafen
- fix gamepad mapping if more then one for ares
- fix starting game immediately after closing it

### ❗️ Breaking Changes
- `.3ds` rename to `.cci`: Due to the switch from Lime3DS to Azahar `.3ds` files are no longer supported. For more information head over to the [Azahar Blog](https://azahar-emu.org/blog/game-loading-changes/)
- changed command line options from camel-case to kebab-case
  - `--debugEmuze` to `--debug-emuze`
  - `--rmgN64` to `--rmg`

### 🐞 Open Bugs
- dinput gamepads are not mapped correctly on mednafen
- switch gamepads do not work in emuze on linux
- dinput gamepads do not work reliably after closing a game in emuze on windows

## 0.54.0

As long as I have been working on emuze, there was one topic that I was never really satisfied with: The first import when setting up emuze took far too long. The reason is quite simple: To retrieve meta data a request has to be sent to the igdb api. Like every service, igdb has a rate limit and authentication that I have to comply with. In order to take care of this and not get into financial trouble, a serverless server has been my solution for fetching meta data to this day. However, this led to the fact that the first import at cold start of the server could take a good 40 seconds for a large game collection.

To tackle the problem, I now bundle the meta data from igdb with emuze. This allows me to optimize the meta data for fast and efficient access. The first import on my Steam Deck with a game collection of over 800 games now takes less than 2 seconds instead of the previous 40 seconds 🚀

Because of the bundling i was finally able to loosen the import, so that roman numerals and numbers are interchangeable. Therefore it does not matter anymore if you name your rom `Final Fantasy V` or `Final Fantasy 5`, emuze will find meta data regardless.

Besides import optimization i decided to use `ares` as the default emulator for the 3 Game Boy Systems. This results in a more accurate emulation and pre configuring of these systems. With this 23 of the 33 supported systems are pre configured and 18 of them are bundled now🥳

Please let me know what you think of it in the [emuze discord](https://discord.gg/tCzK7kc6Y4).

### 💥 Features
- Import time significantly reduced
  - MetaData from igdb is bundled with emuze now. Therefore the import is much faster
  - roman numerals and numbers are interchangeable, e.g. `Final Fantasy V` and `Final Fantasy 5` work both
- set ares as the default emulator for Game Boy, Game Boy Color and Game Boy Advance
  - In contrast to mGBA, ares requires a firmware / bios file to run Game Boy Advance games
  - You can switch back to mGBA with the command line option `--mgba` if you like
- support `.gbc` file type for Game Boy Color games

### 💫 Updates / Bundles
- update bundled Ryujinx to v1.2.86
- update bundled ares to v143
- update bundled Dolphin to v2503

### ❗️ Breaking Changes
- Game Boy, Game Boy Color and Game Boy Advance won't be combined under Game Boy anymore. Therefore you need to create separate folders for these specific systems
- NeoGeo Pocket and NeoGeo Pocket Color won't be combined under NeoGeo Pocket anymore. Therefore you need to create separate folders for these specific systems

## 0.53.1

### 🪲 Bug Fixes
- fix bundled Dolphin on Linux

## 0.53.0

This release is a big step forward towards version 1.0.
20 of the 33 supported systems are pre configured and 15 of them are bundled now.
This helps to make emuze a much more unified and console like experience.

To achieve this i had to build an [appimage](https://github.com/bmsuseluda/ares-emu-appimage) for one of my favorite emulators ares, which was released in [v142](https://ares-emu.net/news/ares-v142-released) lately.
On top of this i decided to make ares the default emulator for n64 games, because it is much more accurate then RMG.

In the last release i had to bundle an older version of Dolphin, because the sdl library i was using was outdated and resulted in gamepad mapping problems with the latest dolphin version and the Steam Deck. I had to fork this lib to achive compatibility again and now the latest version of Dolphin is bundled.

Mednafen is not just the best Sega Saturn Emulator out there, it handles PC Engine CD realy well too. Therefore i wanted to pre configure these systems for quite a while and oh boy this was a lot of work, but now it is done. Please let me know if you find some remaining bugs with it.

Hands down: DuckStation is the best PlayStation emulator. It is feature rich with upscaling and PGP correction, CHD support and so much more and is probably the most accurate PlayStation emulator on top of all this.
Last year the license was changed and with this it is not allowed anymore to bundle nor pre configure DuckStation.
But bundling and pre configuring is my main goal for v1.0 so i decided to bundle the last version of DuckStation that was released under GPL3. Therefore DuckStation will not be updated in emuze anymore and treated as Legacy for the forseeable future.

For the next release i would like to pre configure Mame and bundle some more systems.

Please let me know what you think of it in the [emuze discord](https://discord.gg/tCzK7kc6Y4).

### 💥 Features
- pre configure Mednafen
- map keyboard if no controller is connected on Mednafen
- map keyboard if no controller is connected on Ryujinx
- map keyboard if no controller is connected on ares
- set ares as the default emulator for N64. You can switch back to RMG with the command line option `--rmgN64` if your system struggles to handle 60vps
- forward fullscreen to Mednafen if fullscreen is active in emuze
- optimize volume balance on pc engine cd games
- optimize loading animation
- show message if no roms or system folders were found
- add command line option `--help` to show the available command line options

### 💫 Updates / Bundles
- update bundled Ryujinx to v1.2.81
- update bundled Dolphin to v2412
- bundle ares v142
- bundle DuckStation v0.1-7371. Due to licensing changes DuckStation will no longer receive updates in emuze

### 🪲 Bug Fixes
- prevent keyboard presses in emuze while playing a game
- fix missing audio with mednafen on linux
- fix dolphin gamepad mapping for more then 1 player

## 0.52.1

### 💥 Features
- pre configure Ryujinx
- bundle Ryujinx v1.2.76
- pre configure Dolphin
- bundle Dolphin 2407
- find meta data without subtitle if there is only one match on the specific system e.g. for `Max Payne 2.chd` emuze will find meta data now
- Overview in [Readme](https://github.com/bmsuseluda/emuze?tab=readme-ov-file#%EF%B8%8F-supported-systems) which Systems are bundled with emuze

### 🪲 Bug Fixes
- do not show update and dlc files for Nintendo Switch
- forward fullscreen setting to emulators was not reliable

## 0.51.0

### 💥 Features
- group game versions and discs (You have to `Import all` again)
- sort roman numerals in game names
- several small ui optimizations
- speed up import process

### 🪲 Bug Fixes
- dos, scumm and ps3 games did not update game name if set once
- scumm detect game name did not work reliably
- fetch igdb meta data did not work reliably
- Settings -> General: Remove error message if new path was choosen
- remove duplicate `PlayStation All-Stars Battle Royale` entry in PS3 Game Grid

## 0.50.0

### 💥 Features
- add last played games grid
- simplify settings appearance page
- use [Rosalie's Mupen GUI](https://github.com/Rosalie241/RMG) for N64
- `Import Games` and `Import all` can be triggered from the Sidebars as well
- add `.md` as supported mega drive file extension
- throttle keyboard presses equal to gamepad presses
- optimize performance
- if focus on sidebar, gamepad back button press returns to first system in sidebar
- differentiate between active and focused sidebar link to make more clear which element is focused

### 🪲 Bug Fixes
- stay in the current system after `Import all`
- `Install missing Emulators` does not remove games from view anymore
- remember focused game in grid if on sidebar but same system
- fixed focus after settings
- fixed unintended scrolling in sidebar on mouse click
- mouse click on appearance settings does set focus correctly

## 0.49.0

### 💥 Features
- pre configure rumble for n64
- pre configure gamepads for playstation
- pre configure gamepads for playstation 2
- Overview in [Readme](https://github.com/bmsuseluda/emuze?tab=readme-ov-file#%EF%B8%8F-supported-systems) which Systems will be pre configured
- add `.fc` and `.unh` as supported nes file extensions

### 🪲 Bug Fixes
- Games are too small on 4k resolutions
- fix `Import all` on first start without internet connection

## 0.48.0

### 💥 Features
- add Neo Geo Pocket and Color support
- map left analog stick to dpad if the emulated system does not have a analog stick
  - NES
  - SNES
  - PC Engine
  - Sega Master System
  - Sega Game Gear
  - Sega Mega Drive
  - Sega 32X
  - Sega CD
  - Neo Geo Pocket
  - Neo Geo Pocket Color
- map Steam Deck controls after other connected gamepads to play on a TV
- make search for meta data more flexible

### 🪲 Bug Fixes
- import supported emulators if not the default
  - fixes citra and yuzu
- scummvm detect would not work on first import
- reset disconnected gamepads on ares
- use limit and offset on igdb requests to get meta data for more than 500 games per system
- fast navigation inputs were blocked

## 0.47.1

### 💥 Features
- holding buttons to scroll fast
- set flatpak filesystem rule for roms path. With this you do not need to give permission to your roms folder with flatseal 
  - if your bios files are in another directory you have to give permission to it
- auto configure gamepads to ares emulator for the following systems
  - Sega Master System
  - Sega Game Gear
  - Sega Mega Drive / Sega Genesis
  - Sega 32x
  - Sega CD
  - Nintendo 64
  - Super Nintendo
  - PC Engine / TurboGrafx-16
- retry fetch meta data if it fails
- add [lime3DS](https://github.com/Lime3DS/Lime3DS) as the default Nintendo 3DS Emulator
- add Donkey.Bas to supported DOS Games

## 0.46.0

### 💥 Features
- add support for more dos games (based on a [whitelist](https://github.com/bmsuseluda/emuze/blob/main/app/server/applicationsDB.server/applications/dosbox/nameMapping/dos.json) for now)
- use ScummVM detect to load MetaData
- preconfigure puNES shortcuts and gamepad
- set puNES as the default emulator for NES
- set Ryujinx as the default emulator for switch

### 🪲 Bug Fixes
- fix some ps3 mappings
- do not show "Install Emulators" Button on Windows, because it is not supported
- prevent scrolling on mouse double click
- fix some emulators could not be found on windows
- catch error if `Emulators Path` or `Roms Path` do not exist anymore
- catch error if rom does not exist anymore
- make eror dialogs controllable with gamepads
- reuse old metaData if import fails

### 📣 Info
- citra and yuzu can not be installed anymore, because they were removed from flathub. If you have them installed already they will work like before

## 0.45.0

### 💥 Features
- add support for ScummVM
- add support for Playstation 3
- add alpha support for dos (based on a [whitelist](https://github.com/bmsuseluda/emuze/blob/main/app/server/nameMappings/dos.json) for now)

### 🪲 Bug Fixes
- fix Play! integration
- fix "Install Emulators" could not be triggered via gamepad

## 0.44.0

### 💥 Features
- add Game Gear system and emulators
- add PC Engine SuperGrafx system
- add Wii U system and emulators
- add Switch system and emulators
- support gdi and cdi format for flycast

## 0.43.0

### 💥 Features
- show fallback game image if offline and there is no cache
- add fullscreen support for dolphin
- add rvz support for dolphin
- add Rosalie's Mupen GUI Emulator
- add fullscreen support for flycast

## 0.42.0

### 💥 Features
- add chd support for ppsspp
- update mame database

### 🪲 Bug Fixes
- fix fullscreen mode for puNES
- fix entry scaling
