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

<br>

<p>
  <img src="https://github.com/bmsuseluda/emuze/blob/main/screenshots/library.png?raw=true" alt="Library" />
</p>
<p>
  <img src="https://github.com/bmsuseluda/emuze/blob/main/screenshots/library_collapsed.png?raw=true" alt="Library collapsed" />
</p>

## 🕹️ Supported Systems

The following systems are supported:

| System | Emulator | Pre Configured | BIOS needed |
|--------|----------|----------------|-------------|
| Sony Playstation | [DuckStation](https://github.com/stenzek/duckstation) | Yes | Yes | 
| Sony Playstation 2 | [PCSX2](https://github.com/PCSX2/pcsx2) | Yes | Yes | 
| Sony Playstation 3 | [RPCS3](https://github.com/RPCS3/rpcs3) | No | Yes | 
| Sony Playstation Portable | [PPSSPP](https://github.com/hrydgard/ppsspp) | No | No | 
| Nintendo Entertainment System | [Ares](https://github.com/ares-emulator/ares) | Yes | No | 
| Super Nintendo Entertainment System | [Ares](https://github.com/ares-emulator/ares) | Yes | No | 
| Nintendo Game Boy | [mgba](https://github.com/mgba-emu/mgba) | No | No | 
| Nintendo Game Boy Color | [mgba](https://github.com/mgba-emu/mgba) | No | No | 
| Nintendo Game Boy Advance | [mgba](https://github.com/mgba-emu/mgba) | No | No | 
| Nintendo DS | [MelonDS](https://github.com/melonDS-emu/melonDS) | No | Yes | 
| Nintendo 3DS | [Lime3DS](https://github.com/Lime3DS/Lime3DS) | No | Yes | 
| Nintendo 64 | [Rosalie's Mupen GUI](https://github.com/Rosalie241/RMG) | No | No | 
| Nintendo Gamecube | [Dolphin](https://github.com/dolphin-emu/dolphin) | No | No | 
| Nintendo Wii | [Dolphin](https://github.com/dolphin-emu/dolphin) | No | No | 
| Nintendo Wii U | [Cemu](https://github.com/cemu-project/Cemu) | No | Yes | 
| Nintendo Switch | [Ryujinx](https://github.com/Ryujinx/Ryujinx) | No | Yes | 
| PC Engine | [Ares](https://github.com/ares-emulator/ares) | Yes | No | 
| PC Engine CD | [Mednafen](https://mednafen.github.io/) | No | Yes | 
| PC Engine SuperGrafx | [Mednafen](https://mednafen.github.io/) | No | Yes | 
| Sega Master System | [Ares](https://github.com/ares-emulator/ares) | Yes | No | 
| Sega Game Gear | [Ares](https://github.com/ares-emulator/ares) | Yes | No | 
| Sega Mega Drive | [Ares](https://github.com/ares-emulator/ares) | Yes | No | 
| Sega 32X | [Ares](https://github.com/ares-emulator/ares) | Yes | No | 
| Sega CD | [Ares](https://github.com/ares-emulator/ares) | Yes | Yes | 
| Sega Saturn | [Mednafen](https://mednafen.github.io/) | No | Yes | 
| Sega Dreamcast | [Flycast](https://github.com/flyinghead/flycast) | No | Yes | 
| Arcade | [Mame](https://github.com/mamedev/mame) | No | Yes | 
| Neo Geo | [Mame](https://github.com/mamedev/mame) | No | Yes | 
| Neo Geo CD | [Mame](https://github.com/mamedev/mame) | No | No | 
| Neo Geo Pocket | [Ares](https://github.com/ares-emulator/ares) | Yes | Yes | 
| Neo Geo Pocket Color | [Ares](https://github.com/ares-emulator/ares) | Yes | Yes | 
| Scumm | [ScummVM](https://github.com/scummvm/scummvm) | Yes | No | 
| Dos ([Supported Games](https://github.com/bmsuseluda/emuze/blob/main/app/server/applicationsDB.server/applications/dosbox/nameMapping/dos.json)) | [DOSBox-Staging](https://github.com/dosbox-staging/dosbox-staging) | No | No | 

> [!IMPORTANT]  
> ❤️ Many thanks to all emulator developers. Without you and your awesome work this wouldn't be possible.

### Pre Configured
If a System is pre configured, all connected gamepads will be configured for the specific Emulator.

The following Hotkeys are set:
- Open Menu / Toggle Fullscreen: F2
- Save State: F1
- Load State: F3

### BIOS needed
Some emulators need a BIOS or firmware to run. Please check the documentation of an emulator for more information. 

## 🚀 Getting started

### Windows

[Download](https://github.com/bmsuseluda/emuze/releases/download/v0.50.0/emuze-Setup-0.50.0.exe) the latest Version of emuze and install it.

If you start emuze for the first time, it asks for the following folders to work:

- [Emulators folder (Windows only)](#emulators-folder-windows-only)
- [Roms folder](#roms-folder)

You can change the folders in the settings.

#### Emulators Folder (Windows only)

This is the folder where your emulators are installed. It is only necessary on Windows.
On Linux all emulators need to be installed via flatpak but emuze can do this for you.

```
emulators
|-> ares-v135
|---> ...
|---> ares.exe
|---> ...
|-> duckstation-Windows-x64-release
|---> ...
|---> duckstation-qt-x64-ReleaseLTCG.exe
|---> ...
```

### Linux

For now emuze is only released as an AppImage. Your distribution needs to support Flatpaks.

1) [Download](https://github.com/bmsuseluda/emuze/releases/download/v0.50.0/emuze-0.50.0.AppImage) the latest Version of emuze

2) Mark the AppImage as executable and start emuze
3) Choose the [folder where your Roms are located](#roms-folder)

### Steam Deck in Game mode

For now emuze is only released as an AppImage.

1) Switch to Desktop
2) [Download](https://github.com/bmsuseluda/emuze/releases/download/v0.50.0/emuze-0.50.0.AppImage) the latest Version of emuze

3) Mark the AppImage as executable and start emuze
4) Choose the [folder where your Roms are located](#roms-folder)
5) Add it via `Add a Non-Steam Game` to Steam and rename it to `emuze` 
6) Add `--no-sandbox` as a launch option to the added Shortcut in Steam via `Properties` -> `Shortcut` -> `LAUNCH OPTIONS`.
7) Switch to Game Mode

#### Steam Input Profile

There is a Steam Input Profile with the name `emuze`, which has some Hotkeys pre configured on the back pedals of the Steam Deck.

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

> [!TIP]
> [igdb](https://www.igdb.com) is a community driven open source database for game information. If there is something missing or wrong, please help and correct it there.

### Games with a Subtitle

If a game has a subtitle, the subtitle needs to be in the file name.<br>
For the title `Max Payne 2` emuze wouldn't find metadata. Correct would be `Max Payne 2: The Fall of Max Payne.chd`.

On Windows special characters like `:` can't be part of a file name, therefore you have to write it the following:
`Max Payne 2 - The Fall of Max Payne.chd`

### Games with multiple Discs

If you have a game with multiple discs, like `Final Fantasy VII`, the file name for the first disc would be `Final Fantasy VII (Disc 1).chd`.

### Games with multiple Versions (e.g. Regions)

If you have multiple versions of a game you can specify them in brackets, e.g. the file name for the japanese version of `Castlevania` would be `Castlevania (J).nes`.

## 🚑️ Support

If you have questions, found a bug or have a feature request, feel free to create an issue or join the [Discord](https://discord.gg/tCzK7kc6Y4).
