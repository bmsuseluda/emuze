<p align="center">
  <img src="https://raw.githubusercontent.com/bmsuseluda/emuze/main/artwork/logo400x400.png" alt="Logo" />
</p>

💥 [Features](#-features) | 🕹️ [Supported Systems](#%EF%B8%8F-supported-systems) | 🚀 [Getting Started](#-getting-started) | 🪄 [Metadata](#-metadata) | 🚑️ [Support](#%EF%B8%8F-support)

My main goal for emuze is to have a emulation launcher that is as fast and simple as possible. With this you don't have to configure every emulator and fine tune metadata of your roms.
If your roms are named correctly, a click on the import button should import your emulators and roms altogether and therefore no configuration is necessary.

## 💥 Features

- ⚡️ Fast and responsive UI
- 🚂 Import all your emulators and roms with a click of a button
- 🪄 Fetches Metadata from [igdb](https://www.igdb.com) based on the filenames of your roms
- 🎮️ Gamepad support
- 💻️ Windows, Linux and Steam Deck support
- 🔧 Can install missing emulators (Linux only)
- 💫 Updates itself

<br>

<p>
  <img src="https://github.com/bmsuseluda/emuze/blob/main/screenshots/library.png?raw=true" alt="Library" />
</p>
<p>
  <img src="https://github.com/bmsuseluda/emuze/blob/main/screenshots/library_collapsed.png?raw=true" alt="Library collapsed" />
</p>

## 🕹️ Supported Systems

The following systems are supported:

| System | Emulator | Pre Configured | Bundled | BIOS needed |
| ------ | -------- | -------------- | ------- | ----------- |
| Sega Master System | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | No |
| Sega Game Gear | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | No |
| Sega Mega Drive | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | No |
| Sega 32X | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | Yes |
| Sega CD | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | Yes |
| Sega Saturn | [Mednafen](https://mednafen.github.io/) | Yes | No | Yes |
| Sega Dreamcast | [Flycast](https://github.com/flyinghead/flycast) | No | No | No |
| Nintendo Entertainment System | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | No |
| Super Nintendo Entertainment System | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | No |
| Nintendo Game Boy | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | No |
| Nintendo Game Boy Color | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | No |
| Nintendo Game Boy Advance | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | Yes |
| Nintendo DS | [MelonDS](https://github.com/melonDS-emu/melonDS) | No | No | No |
| Nintendo 3DS | [Lime3DS](https://github.com/Lime3DS/Lime3DS) | No | No | No |
| Nintendo 64 | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | No |
| Nintendo Gamecube | [Dolphin](https://github.com/dolphin-emu/dolphin) | Yes | Yes | No |
| Nintendo Wii | [Dolphin](https://github.com/dolphin-emu/dolphin) | Yes | Yes | No |
| Nintendo Wii U | [Cemu](https://github.com/cemu-project/Cemu) | No | No | Yes |
| Nintendo Switch | [Ryujinx](https://git.ryujinx.app/ryubing/ryujinx) | Yes | Yes | Yes |
| Sony PlayStation | [DuckStation (Legacy)](https://github.com/stenzek/duckstation) | Yes | Yes | Yes |
| Sony PlayStation 2 | [PCSX2](https://github.com/PCSX2/pcsx2) | Yes | No | Yes |
| Sony PlayStation 3 | [RPCS3](https://github.com/RPCS3/rpcs3) | No | No | Yes |
| Sony PlayStation Portable | [PPSSPP](https://github.com/hrydgard/ppsspp) | No | No | No |
| PC Engine | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | No |
| PC Engine CD | [Mednafen](https://mednafen.github.io/) | Yes | No | Yes |
| PC Engine SuperGrafx | [Mednafen](https://mednafen.github.io/) | Yes | No | Yes |
| Arcade | [Mame](https://github.com/mamedev/mame) | No | No | No |
| Neo Geo | [Mame](https://github.com/mamedev/mame) | No | No | No |
| Neo Geo CD | [Mame](https://github.com/mamedev/mame) | No | No | No |
| Neo Geo Pocket | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | Yes |
| Neo Geo Pocket Color | [ares](https://github.com/ares-emulator/ares) | Yes | Yes | Yes |
| Scumm | [ScummVM](https://github.com/scummvm/scummvm) | Yes | No | No |
| Dos ([Supported Games](https://github.com/bmsuseluda/emuze/blob/main/app/server/applicationsDB.server/applications/dosbox/nameMapping/dos.json)) | [DOSBox-Staging](https://github.com/dosbox-staging/dosbox-staging) | No | No | No |

> [!IMPORTANT]  
> ❤️ Many thanks to all emulator developers. Without you and your awesome work this wouldn't be possible.

### Pre Configured

If a System is pre configured, all connected gamepads will be configured for the specific Emulator.

The following Hotkeys are set:

- Open Emulator Menu (if supported from emulator): F2
- Save State: F1
- Load State: F3
- Fullscreen: F11

### Bundled

If a system is bundled, the respective emulator is provided with emuze in a specific version. Therefore you do not need to provide the emulator on your own.

### BIOS needed

Some emulators need a BIOS or firmware to run. Please check the documentation of an emulator for more information.

## 🚀 Getting started

### Windows

[Download](https://github.com/bmsuseluda/emuze/releases/download/v0.54.0/emuze-Setup-0.54.0.exe) the latest Version of emuze and install it.

If you start emuze for the first time, it asks for the following folders to work:

- [Emulators folder (Windows only)](#emulators-folder-windows-only)
- [Roms folder](#roms-folder)

You can change the folders in the settings.

#### Emulators Folder (Windows only)

This is the folder where your emulators are installed. It is only necessary on Windows and only for emulators not bundled by emuze.

```
emulators
|-> ppsspp_win
|---> ...
|---> PPSSPPWindows64.exe
|---> ...
|-> mednafen-1.32.1-win64
|---> ...
|---> mednafen.exe
|---> ...
```

### Linux

For now emuze is only released as an AppImage. Your Linux distribution needs to support Flatpaks.
All emulators, not bundled, need to be installed via flatpak but emuze can do this for you.

1. [Download](https://github.com/bmsuseluda/emuze/releases/download/v0.54.0/emuze-0.54.0.AppImage) the latest Version of emuze

2) Mark the AppImage as executable and start emuze
3) Choose the [folder where your Roms are located](#roms-folder)

### Steam Deck in Game mode

For now emuze is only released as an AppImage.

1. Switch to Desktop

2) [Download](https://github.com/bmsuseluda/emuze/releases/download/v0.54.0/emuze-0.54.0.AppImage) the latest Version of emuze

3. Mark the AppImage as executable and start emuze
4. Choose the [folder where your Roms are located](#roms-folder)
5. Add it via `Add a Non-Steam Game` to Steam and rename it to `emuze`
6. Add `--no-sandbox` as a launch option to the added Shortcut in Steam via `Properties` -> `Shortcut` -> `LAUNCH OPTIONS`.
7. Switch to Game Mode

#### Steam Input Profile

There is a Steam Input Profile with the name `emuze`, which has some Hotkeys pre configured on the back pedals of the Steam Deck.

> [!IMPORTANT]
> Steam Input can result in gamepads not being able to be used correctly in some emulators. Therefore, I recommend disabling Steam Input for all gamepads except the Steam Deck controller.

#### SteamGridDB

There are several assets for emuze on [SteamGridDB](https://www.steamgriddb.com/game/5441011) which you can use via the SteamGridDB Plugin in [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader).

#### On an external Monitor / TV

If you use your Steam Deck on an external Monitor or TV I recommend switching to the native resolution via `Properties` -> `Shortcut` -> `Game Resolution` to `Native`.

### Roms Folder

The Roms need to be grouped by their System. E.g. `Final Fantasy VII.chd` needs to be stored in a folder `Playstation`.

```
roms
|-> Playstation
|---> Tekken 2.chd
|---> Crash Bandicoot.chd
|---> Final Fantasy VII.chd
|---> ...
|-> Super Nintendo
|---> Super Metroid.sfc
|---> Terranigma.sfc
|---> ...
```

## 🪄 Metadata

Metadata provides additional information about your games, e.g.

- Cover art
- Description
- Genre
- ...

> [!NOTE]
> Right now, emuze only fetches Cover art for your games.

Metadata will be fetched from [igdb](https://www.igdb.com). emuze crawls the name and alternative name of a game filtered by the specific system.
The Search is case-insensitive.

> [!TIP] > [igdb](https://www.igdb.com) is a community driven open source database for game information. If there is something missing or wrong, please help and correct it there.

### Games with multiple Discs

If you have a game with multiple discs, like `Final Fantasy VII`, the file name for the first disc would be `Final Fantasy VII (Disc 1).chd`.

### Games with multiple Versions (e.g. Regions)

If you have multiple versions of a game you can specify them in brackets, e.g. the file name for the japanese version of `Castlevania` would be `Castlevania (J).nes`.

## 🔧 Commandline Options

```
Usage: emuze [options]

Options:
  --help             Show help
  --fullscreen       Start the app in fullscreen mode
  --debugEmuze       Activates verbose logging to .emuze/emuze.log
  --rmgN64           Activates the less accurate Rosalies Mupen GUI (RMG) emulator to play N64
  --mgba             Activates the mgba emulator to play Game Boy
  --no-sandbox       Necessary if emuze is used as a non steam game (Steam Deck Game Mode)
```

## 🚑️ Support

If you have questions, found a bug or have a feature request, feel free to create an issue or join the [Discord](https://discord.gg/tCzK7kc6Y4).
