import type { Meta, StoryObj } from "@storybook/react-vite";

import { ReleaseNotesDialog } from "./index.js";

const meta = {
  component: ReleaseNotesDialog,
} satisfies Meta<typeof ReleaseNotesDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    releaseNotesMarkdown: `# Changelog

## 0.58.0

As one of the few nerdy kids in a small sleepy town in a country where arcade gaming was classified as gambling i could see lightgun games in magazines only. I had an NES and Captain N with his Zapper was sooo awesome to me. But when the time came that i could buy one with my own money the rise of flat panels began and with it the death of CRT TVs and Lightguns altogether. It was just a thing of the past, sadly.
But surprisingly the genre came back with the Wii and PS3 and there Pointer devices. Some years later camera based Lightguns came to the market and finally Lightgun gaming with the same and even higher precision is possible on flat panels.
Last year i fulfilled my childhood dream and brought a Retro Shooter Reaper. It was expensive but it was worth it. Playing Time Crisis or House of the Dead 3 with a proper Lightgun is a game changer. Enough with the introduction, emuze now has basic Lightgun support for PlayStation and PlayStation 3. As always my goal is to make the experience as plug and play as possible, but my testing is limited. This is just the beginning and i will expand the support with future updates. For more information please have a look into the [documentation](https://github.com/bmsuseluda/emuze?tab=readme-ov-file#-lightgun-support).

Furthermore i squashed a lot of Bugs and did several smaller things like a UI scaling for higher resolutions. Tiny game tiles and controls are a thing of the past now 🙂

Besides this i bundled and pre configured Cemu, Rosalie's Mupen GUI and MAME.
Thanks to [Samueru-sama](https://github.com/Samueru-sama) who created an AppImage for Rosalie's Mupen GUI.
34 of the 35 supported systems are pre configured and 33 of them are bundled now 🥳
For the next release i plan to bundle the last remaining Emulators ScummVM and DOSBox.

Please let me know what you think of it in the [emuze discord](https://discord.gg/tCzK7kc6Y4).

### 💥 Features
- pre configure MAME
- pre configure Cemu
- pre configure Rosalie's Mupen GUI (RMG)
- provide basic Lightgun support for PlayStation and PlayStation 3. For more information please check the [documentation](https://github.com/bmsuseluda/emuze?tab=readme-ov-file#-lightgun-support)
- scale emuze on higher resolutions
- updated Steam Input Profile:
  - Left Touchpad works as a scroll wheel
  - Right Touchpad Click works as Left Mouse Click
  - Left Touchpad Click works as Right Mouse Click
  - Touchscreen can be used to scroll
- greatly improve PlayStation 3 import speed
- add support for PSN PlayStation 1 games (PSOne Classics) with RPCS3
- support \`.pbp\` format for ppsspp to play PSN games like PSP Minis
- support \`.3ds\` format for Azahar
- use deinterlacer \`bob_offset\` to fix interlacing problems with high resolution Saturn games e.g. \`Virtua Fighter 2\`
- use 94% xscale value to fix lightgun aiming in \`Time Crisis\` on PlayStation
- for Nintendo 64 map \`Right Stick Down\` to XBOX \`B\` Button and \`Right Stick Left\` to XBOX \`Y\` Button for games like \`Super Smash Bros.\` to jump properly. This will be mapped on top of the regular mapping
- use native window decoration for Mednafen on Linux, thanks to [Samueru-sama](https://github.com/Samueru-sama)
- synchronize sdl gamecontroller db with bundled emulators
- document [external data](https://github.com/bmsuseluda/emuze?tab=readme-ov-file#-external-data) that is used
- set hotkey to swap screens to \`Right Stick Click\` for Nintendo DS

### 💫 Updates / Bundles
- bundle Rosalie's Mupen GUI v0.8.9
- bundle Cemu v2.6
- update bundled ares to v147
- update bundled Dolphin to v2512
- update bundled melonDS to v1.1
- update bundled RPCS3 to v0.0.39
- update bundled xemu to v0.8.133
- update bundled Flycast to v2.6
- update bundled MAME to v0.285
- update bundled Azahar to v2124.3

### 🪲 Bug Fixes
- fixed overwriting existing config files while syncing config files from emuze folder to emulator folder
- physical PlayStation 3 games could not be started if there were update files for those games
- import of PlayStation 3 games could result in wrongly mixed up game tiles
- L and R Buttons were not mapped correctly for PlayStation Portable on Linux
- fixed settings overlay to large on 4K screens
- if a system was removed, games from this system were not removed from last played
- if a system was removed, going up in the system list wasn't working reliably
- on Steam Deck sometimes emuze did not launch maximized
- fixed keyboard mapping for GameCube and Wii on Windows
- fixed writing config files for several Systems on Windows
- fixed a focus problem on Windows whereby gamepad inputs were not recognized immediately after starting emuze
- fixed a focus problem on Windows whereby gamepad inputs were not recognized after closing a game
- fixed a focus problem on Windows whereby gamepad inputs were not recognized after choosing a Roms Folder

## 0.57.0

Starfox, Space Harrier, Panzer Dragoon... They look awesome, they sound awesome and the action is non stop and thrilling. I love those games, but always thought there are not enough of them. Shoot em up fans had the PC Engine and the Mega Drive. Fighting game fans had the NeoGeo, but Rail Shooter fans?
Back then i did not know, but there was the [Pioneer LaserActive](https://en.wikipedia.org/wiki/LaserActive). A really interesting modular system which combines LaserDiscs with gaming. In particular there were 2 modules. One from NEC based on the PC Engine and one from Sega based on the Mega Drive / Genesis.
These systems were packed with Rail Shooters and FMV games too. Sadly they were really rare and expensive and could not be emulated until last month when Roger Sanders aka Nemesis contributed his work to the multi system emulator [ares](https://github.com/ares-emulator/ares). You can read more about the rocky but fascinating ride Nemesis had to go in the following interviews:
- [Written Interview from Read Only Memo](https://www.readonlymemo.com/this-is-the-first-the-16-year-odyssey-of-time-money-wrong-turns-and-frustration-it-took-to-finally-emulate-the-pioneer-laseractive/)
- [Video Interview from Retro RGB](https://m.youtube.com/watch?v=-yGxV5E7tTw&t=18s&pp=2AESkAIB)

Enough with the long introduction. MegaLD or the Sega Module of the LaserActive is now playable with emuze thanks to ares v146🙂
If you love Rail Shooters like me you have to play \`Pyramid Patrol\`. So head over to archive.org, grab it and don't forget to thank Nemesis on the [ares Discord](https://discord.com/invite/gz2quhk2kv).

The first feature request i got for emuze was support for the original XBOX. At the time i had no games nor Bios to do it properly. Some weeks ago a friend came in with his XBOX and i could have a deeper look at xemu. I have to say this emulator is great, high compatibility, really simple to configure and the ui is usable with a controller.

Besides bundling and pre configuring melonDS and Flycast i created an AppImage for Mednafen. Thanks to [Samueru-sama](https://github.com/Samueru-sama) who created an AppImage for MAME. In general i have to thank the [Package Forge Dev Team](https://github.com/pkgforge-dev) who are providing AppImages that work on nearly every Linux distribution. Due to there efforts it was possible to bundle 5 more emulators but only add around 50mb on top of the last emuze AppImage.

This is a big step towards version 1.0.
30 of the 35 supported systems are pre configured and 32 of them are bundled now🥳

Please let me know what you think of it in the [emuze discord](https://discord.gg/tCzK7kc6Y4).

### 💥 Features
- add new System \`Microsoft XBOX\`
- add new System \`Sega Mega LD\` or \`Pioneer LaserActive Sega PAC\`
- pre configure xemu
- pre configure melonDS
- pre configure Flycast
- map keyboard if no controller is connected for xemu
- map keyboard if no controller is connected for Flycast
- reduce file size of emuze, even so multiple bundled emulators were added, thanks to the [Package Forge team](https://github.com/pkgforge-dev)
- document [supported system names and file extensions](https://github.com/bmsuseluda/emuze?tab=readme-ov-file#supported-system-names-and-file-extensions)
- optimize system name detection: capitalization, special characters and white spaces do not matter anymore. E.g. \`TurboGrafx-16\` will be detected as well as \`turbo grafx 16\`.
- support \`.zip\` for emulators that are compatible with
- Emulators Path is now optional on windows

### 💫 Updates / Bundles
- bundle xemu v0.8.106
- bundle Flycast v2.5
- bundle melonDS v1.0
- bundle Mednafen v1.32.1
- bundle MAME v0.281
- update bundled ares to v146
- update bundled azahar to v2123.2
- update bundled Dolphin to v2509
- update bundled RPCS3 to v0.0.38

### 🪲 Bug Fixes
- MetaData could not be fetched for rom files with multiple file extensions
- fixed dualshock 3 controller mapping for ares
- fixed dualshock 4 controller dpad mapping for ares
- to play docked with your Steam Deck the Steam Deck Controls will be configured as the last controller for Mednafen
- fixed dinput controller mapping for Mednafen
- fixed mapping of second device for Mednafen
- fixed starting Mednafen in Window Mode (not fullscreen)
- fixed 8bitdo sfc30 controller mapping for Mednafen
- fixed duplicate inputs with Steam Input for Mednafen
- fixed Updater not working on Steam Deck Game Mode
- fixed keyboard mapping for Mednafen
- fixed dinput controller mapping for azahar

### ❗️ Breaking Changes
- removed redundant emulators
  - mgba
  - lime3ds`,
    onClose: () => {},
  },
};
