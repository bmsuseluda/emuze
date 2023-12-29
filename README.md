# emuze - Launch your Games fast and simple

## Motivation

My main goal for emuze is to have a launcher that is as fast and simple as possible. With this you don't have to configure every emulator and fine tune metadata of your roms. If your roms are named correctly, a click on the import button should import your emulators and roms altogether and therefore no configuration is necessary.

## Features

- Fast and responsive UI
- Import all your emulators and roms with a click of just one button
- Fetches Metadata from [igdb](https://www.igdb.com) based on the filenames of your roms
- Gamepad support (x-input only)
- windows and linux support
- install missing emulators (linux only)

## Getting started

The application asks for the following folders to work:

- Emulators folder
- Roms folder

You can change the folders in the settings.

### Emulators Folder

```
emulators
|-> Mesen.0.9.9
|---> ...
|---> Mesen.exe
|---> ...
|-> duckstation-windows-x64-release
|---> ...
|---> duckstation-qt-x64-ReleaseLTCG.exe
|---> ...
```

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

## Metadata

Metadata will be fetched from [igdb](https://www.igdb.com). The application crawls the name and alternative name of a game filtered by the specific platform.
The Search is case-insensitive.

> INFO: [igdb](https://www.igdb.com) is a community driven open source database for game information. If there is something missing or wrong, please help and correct it there.

### Games with a Subtitle

If a game has a subtitle, the subtitle needs to be in the file name.<br>
For the title `Max Payne 2` the application wouldn't find metadata. Correct would be `Max Payne 2: The Fall of Max Payne.chd`.

On windows special characters like `:` can't be part of a file name, therefore you have to write it the following:
`Max Payne 2 - The Fall of Max Payne.chd`

### Games with multiple Discs

If you have a game with mutiple discs, like `Final Fantasy VII`, the file name for the first disc would be `Final Fantasy VII (Disc 1).chd`.

### Games with multiple Versions (e.g. Regions)

If you have multiple versions of a game you can specify them in brackets, e.g. the file name for the japanese version of `Castlevania` would be `Castlevania (J).nes`.

## Supported Emulators

Every Emulator needs to be configured in the application by the developer.
Right now the following are supported:

[applicationsDB.server.ts](app/server/applicationsDB.server.ts)

> INFO: If you miss an emulator or find an error in the configuration, please create a pull request or issue.

## Configuration

### Keyboard Shortcuts

`F11` Toggle fullscreen

### Commandline Arguments

`--fullscreen` Start in fullscreen

`--no-sandbox` Launch as a Non-Steam Game in SteamOS, see [Running on Steam Deck in Game mode](#running-on-steam-deck-in-game-mode) 

## Known Issues

- Fetching metadata for games like `Super Mario Bros. / Tetris / World Cup` is not supported right now due to the limitations of special characters in a windows file name.

## Running on Steam Deck in Game mode

To run emuze on the Steam Deck, mark the AppImage as executable and add it via `Add a Non-Steam Game`.

Use `--no-sandbox` as a launch option to the added Shortcut in Steam via `Properties` -> `Shortcut` -> `LAUNCH OPTIONS`.

### Steam Input Profile

There is a Steam Input Profile with the name `emuze`, which has some hotkeys preconfigured for some emulators on the back pedals of the Steam Deck.

### Give Permission to your roms folder

The emulators on the Steam Deck are distributed via Flatpaks which run in a Sandbox. Out of the box flatpaks can only access folders in your home directory.
If your roms are stored somewhere else you can give access to this folder via `Flatseal`. You can find the app in the Discover-App-Store.

## Roadmap

There is a lot i would like to work on. The following features are the bigger ones in no specific order.

- Bundle emulators
- Preconfigure all emulators
- Release emuze on flathub
- Bundle open source bios implementations
- `Roms as Folder` support for emulators e.g. ScummVM or DosBox
- Filter and sorting of roms
