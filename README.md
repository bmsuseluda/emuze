# Launch your games without hassle

## Motivation

My main goal for emuze is to have a launcher that is as fast and simple as possible. With this you don't have to configure every emulator and fine tune metadata of your roms. If your roms are named correctly, a click on the import button should import your emulators and roms altogether and therefore no configuration is necessary.

## Features

- Fast and responsive UI
- Import all your emulators and roms with a click of just one button
- Fetches Metadata from [igdb](www.igdb.com) based on the filenames of your roms

## Getting started

The application asks for the following folders to work:

- Emulators folder
- Roms folder with a subfolder for every platform

You can change the folders in the settings.

### Emulators folder

TODO: add screenshot
`emulators |-> mesen |---> ... |---> mesen.exe |---> ... |-> duckstation |---> ... |---> duckstation.exe |---> ...`

## Metadata

Metadata will be fetched from [igdb](www.igdb.com). The application crawls the name and alternative name of a game filtered by the specific platform.
The Search is case insensitive.

> INFO: [igdb](www.igdb.com) is a community driven open source database for game information. If there is something missing or wrong, please help and correct it there.

### Games with a subtitle

If a game has a subtitle, the subtitle needs to be in the file name.<br>
For the title `Max Payne 2` the application wouldn't find metadata. Correct would be `Max Payne 2: The Fall of Max Payne`.

On windows special characters like `:` can't be part of a file name, therefore you have to write it the following:
`Max Payne 2 - The Fall of Max Payne`

### Games with multiple discs

If you have a game with mutiple discs, like Final Fantasy VII, the file name for the first disc would be `Final Fantasy VII (Disc 1).chd`.

### Games with multiple versions (e.g. regions)

If you have multiple versions of a game you can specify them in brackets, e.g. the file name for the japanese version of Castlevania could be `Castlevania (J).nes`.

## Supported Emulators

Every Emulator needs to be configured in the application by the developer.
Right now the following are supported:

[applicationsDB.server.ts](app\server\applicationsDB.server.ts)

> INFO: If you miss an emulator or find an error in the configuration, please create a pull request or issue.

## Known Issues

- Fetching metadata for games like `Super Mario Bros. / Tetris / World Cup` is not supported right now due to the limitations of special characters in a windows file name.
- For a platform metadata can only be fetched for 500 titles.
