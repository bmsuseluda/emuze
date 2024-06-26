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

| System | Emulator | Pre Configured |
|--------|----------|----------------|
| Sony Playstation | DuckStation | Yes |
| Sony Playstation 2 | PCSX2 | Yes |
| Sony Playstation 3 | RPCS3 | No |
| Sony Playstation Portable | PPSSPP | No |
| Nintendo Entertainment System | Ares | Yes |
| Super Nintendo Entertainment System | Ares | Yes |
| Nintendo Game Boy | mgba | No |
| Nintendo Game Boy Color | mgba | No |
| Nintendo Game Boy Advance | mgba | No |
| Nintendo DS | MelonDS | No |
| Nintendo 3DS | Lime3DS | No |
| Nintendo 64 | Ares | Yes |
| Nintendo Gamecube | Dolphin | No |
| Nintendo Wii | Dolphin | No |
| Nintendo Wii U | Cemu | No |
| Nintendo Switch | Ryujinx | No |
| PC Engine | Ares | Yes |
| PC Engine CD | Mednafen | No |
| PC Engine SuperGrafx | Mednafen | No |
| Sega Master System | Ares | Yes |
| Sega Game Gear | Ares | Yes |
| Sega Mega Drive | Ares | Yes |
| Sega 32X | Ares | Yes |
| Sega CD | Ares | Yes |
| Sega Saturn | Mednafen | No |
| Sega Dreamcast | Flycast | No |
| Arcade | Mame | No |
| Neo Geo | Mame | No |
| Neo Geo CD | Mame | No |
| Neo Geo Pocket | Ares | Yes |
| Neo Geo Pocket Color | Ares | Yes |
| Scumm | ScummVM | Yes |
| Dos ([Supported Games](https://github.com/bmsuseluda/emuze/blob/main/app/server/applicationsDB.server/applications/dosbox/nameMapping/dos.json)) | DOSBox-Staging | No |

> [!IMPORTANT]  
> ❤️ Many thanks to all emulator developers. Without you and your awesome work this wouldn't be possible.

### Pre Configured
If a System is pre configured, all connected gamepads will be configured for the specific Emulator.

The following Hotkeys are set:
- Open Menu / Toggle Fullscreen: F2
- Save State: F1
- Load State: F3

## 🚀 Getting started

### Windows

[Download](https://github.com/bmsuseluda/emuze/releases/download/v0.48.0/emuze-Setup-0.48.0.exe) the latest Version of emuze and install it.

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

1) [Download](https://github.com/bmsuseluda/emuze/releases/download/v0.48.0/emuze-0.48.0.AppImage) the latest Version of emuze

2) Mark the AppImage as executable and start emuze
3) Choose the [folder where your Roms are located](#roms-folder)

### Steam Deck in Game mode

For now emuze is only released as an AppImage.

1) Switch to Desktop
2) [Download](https://github.com/bmsuseluda/emuze/releases/download/v0.48.0/emuze-0.48.0.AppImage) the latest Version of emuze

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
