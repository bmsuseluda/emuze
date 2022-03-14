# Launch your games without hassle

Simple Games Library Emulator Launcher

## Motivation

My main goals for this launcher are to have a launcher that is as fast and simple as possible. With this you don't have to configure every emulator and fine tune metadata of your roms. If your roms are named correctly then a click on the import button should import your emulators and roms altogether and therefore hopefully no configuration is necessary.

## Features

- fast and responsive UI
- Import all your emulators and roms with a click of just one button
- Fetches Metadata from [igdb](www.igdb.com) based on the filenames of your roms

## Getting started

The application asks for the following folders to work:

- emulators folder
- roms folder with a subfolder for every platform

You can change the folders initially in the wizard or afterwards in the settings.

## Metadata

Metadata will be fetched from [igdb](www.igdb.com). The application crawls the name and alternative name of a game filtered by the specific platform.
The Search is case insensitive.

> INFO: [igdb](www.igdb.com) is a community driven open source database for game information. If there is something missing or wrong, please help us all and correct it there.

### Games with a subtitle

Right now if a game has a subtitle, the subtitle needs to be in the file name.<br>
For the title `Max Payne 2` the application wouldn't find metadata. Correct would be `Max Payne 2: The Fall of Max Payne`.

On windows special characters like `:` can't be part of a file name, therefore you have to write it the following:
`Max Payne 2 - The Fall of Max Payne`

## Supported Emulators

Every Emulator needs to be configured in the application by the developer.
Right now the following are supported:

[applicationsDB.server.ts](app\server\applicationsDB.server.ts)

> INFO: If you miss an emulator or find an error in the configuration, please create a pull request or issue.

## Known Issues

- Fetching metadata for games like `Super Mario Bros. / Tetris / World Cup` is not supported right now due to the limitations of special characters in a windows file name.
