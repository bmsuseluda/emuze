# emuze
[Features](#features) | [Getting Started](#getting-started) | [Supported Platforms and Emulators](#supported-platforms-and-emulators) | [Roadmap](#roadmap)

My main goal for emuze is to have a emulation launcher that is as fast and simple as possible. With this you don't have to configure every emulator and fine tune metadata of your roms.
If your roms are named correctly, a click on the import button should import your emulators and roms altogether and therefore no configuration is necessary.

## Features

- Fast and responsive UI
- Import all your emulators and roms with a click of a button
- Fetches Metadata from [igdb](https://www.igdb.com) based on the filenames of your roms
- Gamepad support (x-input only)
- Windows and Linux support
- Can install missing emulators (Linux only)

<p>
  <img src="https://github.com/bmsuseluda/emuze/blob/main/screenshots/library.png" alt="Library" />
</p>

## Getting started

### Windows

[Download](https://github.com/bmsuseluda/emuze/releases/latest) the latest version of `emuze.exe` and install it.

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

- [Download](https://github.com/bmsuseluda/emuze/releases/latest) the latest version of `emuze.AppImage`
- Mark the AppImage as executable and start emuze
- Choose the [folder where your Roms are located](#roms-folder)
- [Give permission to your Roms folder](#give-permission-to-your-roms-folder-linux-only)

### Steam Deck in Game mode

For now emuze is only released as an AppImage.

- Switch to Desktop
- [Download](https://github.com/bmsuseluda/emuze/releases/latest) the latest version of `emuze.AppImage`
- Mark the AppImage as executable and start emuze
- Choose the [folder where your Roms are located](#roms-folder)
- [Give permission to your Roms folder](#give-permission-to-your-roms-folder-linux-only)
- Add it via `Add a Non-Steam Game` to Steam and rename it to `emuze` 
- Switch to Game Mode
- Add `--no-sandbox` as a launch option to the added Shortcut in Steam via `Properties` -> `Shortcut` -> `LAUNCH OPTIONS`.

#### Steam Input Profile

There is a Steam Input Profile with the name `emuze`, which has some hotkeys preconfigured for some emulators on the back pedals of the Steam Deck.

### Roms Folder

The roms need to be grouped by their platform. E.g. `Final Fantasy VII.chd` needs to be stored in a folder `Playstation`.

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

### Metadata

Metadata will be fetched from [igdb](https://www.igdb.com). emuze crawls the name and alternative name of a game filtered by the specific platform.
The Search is case-insensitive.

> INFO: [igdb](https://www.igdb.com) is a community driven open source database for game information. If there is something missing or wrong, please help and correct it there.

#### Games with a Subtitle

If a game has a subtitle, the subtitle needs to be in the file name.<br>
For the title `Max Payne 2` emuze wouldn't find metadata. Correct would be `Max Payne 2: The Fall of Max Payne.chd`.

On Windows special characters like `:` can't be part of a file name, therefore you have to write it the following:
`Max Payne 2 - The Fall of Max Payne.chd`

#### Games with multiple Discs

If you have a game with multiple discs, like `Final Fantasy VII`, the file name for the first disc would be `Final Fantasy VII (Disc 1).chd`.

#### Games with multiple Versions (e.g. Regions)

If you have multiple versions of a game you can specify them in brackets, e.g. the file name for the japanese version of `Castlevania` would be `Castlevania (J).nes`.

## Supported Platforms and Emulators

Every Platform and Emulator needs to be configured in the source code of emuze by the developer.
Right now the following are supported:

| Platform     | Emulators | Default Emulator |
|--------------|-----------|------------------|
```mmd
return scripts.createPlatformsTable()
```

> INFO: If you miss an emulator or find an error in the configuration, please create a pull request or issue.

## Roadmap

There is a lot i would like to work on. The following features are the bigger ones in no specific order.

- Bundle emulators
- Preconfigure all emulators
- Release emuze as a Flatpak on Flathub
- Bundle open source bios implementations
- `Roms as Folder` support for emulators e.g. ScummVM or DosBox
- Filter and sorting of roms
- Integrate `How long to beat`
- Show controller glyphs
- Add option to convert bin/cue and iso files to chd
