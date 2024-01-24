<p align="center">
  <img src="https://raw.githubusercontent.com/bmsuseluda/emuze/main/artwork/logo400x400.png" alt="Logo" />
</p>


💥 [Features](#-features) | 🚀 [Getting Started](#-getting-started) | 🪄 [Metadata](#-metadata) | 🕹️ [Supported Systems](#%EF%B8%8F-supported-systems) | 🌈 [Roadmap](#-roadmap) | 🚑️ [Support](#%EF%B8%8F-support)

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

## 🚀 Getting started

### Windows

```mmd
return scripts.getWindowsDownloadLink()
```

If you start emuze for the first time, it asks for the following folders to work:

- [Emulators folder (Windows only)](#emulators-folder-windows-only)
- [Roms folder](#roms-folder)

You can change the folders in the settings.

#### Emulators Folder (Windows only)

This is the folder where your emulators are installed. It is only necessary on Windows.
On Linux all emulators need to be installed via flatpak but emuze can do this for you.

```
emulators
|-> Mesen.0.9.9
|---> ...
|---> Mesen.exe
|---> ...
|-> duckstation-Windows-x64-release
|---> ...
|---> duckstation-qt-x64-ReleaseLTCG.exe
|---> ...
```

### Linux

For now emuze is only released as an AppImage. Your distribution needs to support Flatpaks.

```mmd
return scripts.getLinuxDownloadLink('1) ')
```
2) Mark the AppImage as executable and start emuze
3) Choose the [folder where your Roms are located](#roms-folder)
4) [Give permission to your Roms folder](#give-permission-to-your-roms-folder-linux-only)

### Steam Deck in Game mode

For now emuze is only released as an AppImage.

1) Switch to Desktop
```mmd
return scripts.getLinuxDownloadLink('2) ')
```
3) Mark the AppImage as executable and start emuze
4) Choose the [folder where your Roms are located](#roms-folder)
5) [Give permission to your Roms folder](#give-permission-to-your-roms-folder-linux-only)
6) Add it via `Add a Non-Steam Game` to Steam and rename it to `emuze` 
7) Switch to Game Mode
8) Add `--no-sandbox` as a launch option to the added Shortcut in Steam via `Properties` -> `Shortcut` -> `LAUNCH OPTIONS`.

#### Steam Input Profile

There is a Steam Input Profile with the name `emuze`, which has some hotkeys preconfigured for some emulators on the back pedals of the Steam Deck.

### Roms Folder

The Roms need to be grouped by their System. E.g. `Final Fantasy VII.chd` needs to be stored in a folder `Playstation`.

```
roms
|-> Playstation
|---> Tekken 2.chd
|---> Crash Bandicoot.chd
|---> ...
|-> Super Nintendo
|---> Super Metroid.sfc
|---> Terranigma.sfc
|---> ...
```

### Give Permission to your roms folder (Linux only)

The emulators on the Steam Deck are distributed via Flatpaks which run in a Sandbox. Out of the box Flatpaks can only access folders in your home directory.
If your roms are stored somewhere else you can give access to this folder via `Flatseal`. You can find the app in the Discover-App-Store.

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

## 🕹️ Supported Systems

Every System and Emulator needs to be configured in the source code of emuze by the developer.
Right now the following are supported:

| System | Emulators | Default Emulator |
|--------|-----------|------------------|
```mmd
return scripts.createSystemsTable()
```
> [!IMPORTANT]  
> ❤️ Many thanks to all emulator developers. Without you and your awesome work this wouldn't be possible.

> [!TIP]
> If you miss an emulator or find an error in the configuration, please create a pull request or issue.

## 🌈 Roadmap

There is a lot i would like to work on. The following features are the bigger ones in no specific order.

- Bundle emulators
- Preconfigure all emulators
- Release emuze as a Flatpak on Flathub
- Bundle open source bios implementations
- `Roms as Folder` support for emulators e.g. ScummVM or DosBox
- Filter and sorting of roms
- Integrate `How long to beat`
- Add option to convert bin/cue and iso files to chd

## 🚑️ Support

If you have questions, found a bug or have a feature request, feel free to create an issue or join the [Discord](https://discord.gg/tCzK7kc6Y4).
