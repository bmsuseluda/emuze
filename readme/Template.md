<p align="center">
  <img src="https://raw.githubusercontent.com/bmsuseluda/emuze/main/artwork/logo400x400.png" alt="Logo" />
</p>


💥 [Features](#-features) | 🕹️ [Supported Systems](#%EF%B8%8F-supported-systems) | 🚀 [Getting Started](#-getting-started) | 🚑️ [Support](#%EF%B8%8F-support)

emuze is a emulation frontend designed to simplify your retro gaming experience.
It automates the configuration of each emulator, including seamless gamepad integration and automatic import of games along with their metadata. With its console-like interface and intuitive controls, emuze lets you focus on enjoying your retro games, just like you would on a gaming console.

It is not there yet for every system and emulator, please have a look at 🕹️ [Supported Systems](#%EF%B8%8F-supported-systems) for more details.

## 💥 Features

- ⚡️ Intuitive console-like interface
- 🚂 Import all your roms with a click of a button
- 🪄 Provides Metadata from [igdb](https://www.igdb.com) based on the filenames of your roms
- 🎮️ Seamless gamepad integration for most emulators
- 📦️ Bundles most emulators
- 💻️ Windows, Linux and Steam Deck support
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
```mmd
return scripts.createSystemsTable()
```
> [!IMPORTANT]  
> ❤️ Many thanks to all emulator developers. Without you and your awesome work this wouldn't be possible.

### Pre Configured
If a System is pre configured, all connected gamepads will be configured for the specific Emulator.
If there are no gamepads connected, the keyboard will be configured instead.

<details>
  <summary>Keyboard Mapping</summary>

<br>

| Button | Key |
| ------ | --- |
```mmd
return scripts.createKeyboardMapping()
```
</details>
<br>

The following Hotkeys are set as well:
- Open Emulator Menu (if supported from emulator): `F2`
- Save State: `F1`
- Load State: `F3`
- Fullscreen: `F11`

You can close a game via
- Xbox: `back + a`
- PlayStation: `select + x`
- Nintendo: `select + a`

### Bundled
If a system is bundled, the respective emulator is provided with emuze in a specific version. Therefore you do not need to provide the emulator on your own.

### BIOS needed
Some emulators need a BIOS or firmware to run. Please check the documentation of an emulator for more information.

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

This is the folder where your emulators are installed. It is only necessary on Windows and only for emulators not bundled by emuze.

```
emulators
|-> mame
|---> ...
|---> mame.exe
|---> ...
|-> mednafen-1.32.1-win64
|---> ...
|---> mednafen.exe
|---> ...
```

### Linux

For now emuze is only released as an AppImage.
All emulators, not bundled, need to be installed via flatpak.

```mmd
return scripts.getLinuxDownloadLink('1) ')
```
2) Mark the AppImage as executable and start emuze
3) Choose the [folder where your Roms are located](#roms-folder)

### Steam Deck in Game mode

For now emuze is only released as an AppImage.

1) Switch to Desktop
```mmd
return scripts.getLinuxDownloadLink('2) ')
```
3) Mark the AppImage as executable and start emuze
4) Choose the [folder where your Roms are located](#roms-folder)
5) Add it via `Add a Non-Steam Game` to Steam and rename it to `emuze`
6) Switch to Game Mode

#### Steam Input Profile

There is a Steam Input Profile with the name `emuze`, which has some Hotkeys pre configured on the back pedals of the Steam Deck.

- `L4`: Save State
- `L5`: Load State
- `R4`: Open Emulator Menu (if supported from emulator) or Fullscreen
- `R5`: Left Mouse Click
- `Right Trackpad`: Mouse

#### SteamGridDB

There are several assets for emuze on [SteamGridDB](https://www.steamgriddb.com/game/5441011) which you can use via the SteamGridDB Plugin in [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader).

#### On an external Monitor / TV

If you use your Steam Deck on an external Monitor or TV I recommend switching to the native resolution via `Properties` -> `Shortcut` -> `Game Resolution` to `Native`.

### Roms Folder

The Roms need to be grouped by their System. E.g. `Final Fantasy VII.chd` needs to be stored in a folder `PlayStation`.

```
roms
|-> PlayStation
|---> Tekken 2.chd
|---> Crash Bandicoot.chd
|---> Final Fantasy VII.chd
|---> ...
|-> Super Nintendo
|---> Super Metroid.sfc
|---> Terranigma.sfc
|---> ...
```

## 🔧 Commandline Options

```mmd
return scripts.getCommandLineOptions()
```

## 🚑️ Support

If you have questions, found a bug or have a feature request, feel free to create an issue or join the [Discord](https://discord.gg/tCzK7kc6Y4).
