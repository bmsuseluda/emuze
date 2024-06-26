import {
  blastem,
  bsnes,
  cemu,
  citra,
  desmume,
  dolphin,
  flycast,
  lime3ds,
  mednafen,
  melonds,
  mgba,
  mupen64plus,
  nestopia,
  play,
  ppsspp,
  rosaliesMupenGui,
  ryujinx,
  snes9x,
  yuzu,
} from "../applicationsDB.server";
import { rpcs3 } from "../applicationsDB.server/applications/rpcs3";
import {
  ares,
  aresMegaDrive,
  aresSega32x,
  aresSegaCd,
  aresSuperNintendo,
} from "../applicationsDB.server/applications/ares";
import {
  mame,
  mameNeoGeo,
  mameNeoGeoCD,
} from "../applicationsDB.server/applications/mame";
import { punes } from "../applicationsDB.server/applications/punes";
import { dosboxstaging } from "../applicationsDB.server/applications/dosbox";
import { scummvm } from "../applicationsDB.server/applications/scummvm";
import type { Category } from "./types";
import type { SystemId } from "./systemId";
import { duckstation } from "../applicationsDB.server/applications/duckstation";
import { pcsx2 } from "../applicationsDB.server/applications/pcsx2";

export const sonyplaystation: Category = {
  id: "sonyplaystation",
  names: ["Sony Playstation", "playstation", "psx", "ps1", "psone"],
  igdbPlatformIds: [7],
  applications: [duckstation, mednafen],
  defaultApplication: duckstation,
  hasAnalogStick: true,
};

export const sonyplaystation2: Category = {
  id: "sonyplaystation2",
  names: ["Sony Playstation 2", "playstation 2", "ps2"],
  igdbPlatformIds: [8],
  applications: [pcsx2, play],
  defaultApplication: pcsx2,
  hasAnalogStick: true,
};

export const sonyplaystation3: Category = {
  id: "sonyplaystation3",
  names: ["Sony Playstation 3", "playstation 3", "ps3"],
  igdbPlatformIds: [9],
  applications: [rpcs3],
  defaultApplication: rpcs3,
  hasAnalogStick: true,
};

export const sonypsp: Category = {
  id: "sonypsp",
  names: [
    "Sony Playstation Portable",
    "Playstation Portable",
    "Sony PSP",
    "PSP",
  ],
  igdbPlatformIds: [38],
  applications: [ppsspp],
  defaultApplication: ppsspp,
  hasAnalogStick: true,
};

export const segamastersystem: Category = {
  id: "segamastersystem",
  names: ["Sega Master System", "Master System", "SMS"],
  igdbPlatformIds: [64],
  applications: [ares, blastem, mednafen],
  defaultApplication: ares,
  hasAnalogStick: false,
};

export const segagamegear: Category = {
  id: "segagamegear",
  names: ["Sega Game Gear", "Game Gear", "GameGear"],
  igdbPlatformIds: [35],
  applications: [ares, blastem, mednafen],
  defaultApplication: ares,
  hasAnalogStick: false,
};

export const segamegadrive: Category = {
  id: "segamegadrive",
  names: [
    "Sega Mega Drive",
    "Mega Drive",
    "Sega Megadrive",
    "Sega Genesis",
    "Genesis",
  ],
  igdbPlatformIds: [29],
  applications: [blastem, aresMegaDrive],
  defaultApplication: aresMegaDrive,
  hasAnalogStick: false,
};

export const sega32x: Category = {
  id: "sega32x",
  names: [
    "Sega 32X",
    "32X",
    "Mega 32X",
    "Genesis 32X",
    "Mega Drive 32X",
    "Super 32X",
  ],
  igdbPlatformIds: [30],
  applications: [aresSega32x],
  defaultApplication: aresSega32x,
  hasAnalogStick: false,
};

export const segacd: Category = {
  id: "segacd",
  names: ["Sega CD", "Mega CD", "Sega Mega CD"],
  igdbPlatformIds: [78],
  applications: [aresSegaCd],
  defaultApplication: aresSegaCd,
  hasAnalogStick: false,
};

export const segadreamcast: Category = {
  id: "segadreamcast",
  names: ["Sega Dreamcast", "Dreamcast"],
  igdbPlatformIds: [23],
  applications: [flycast],
  defaultApplication: flycast,
  hasAnalogStick: true,
};

export const supernintendo: Category = {
  id: "supernintendo",
  names: [
    "Super Nintendo Entertainment System",
    "Super Nintendo",
    "SNES",
    "Super Famicom",
  ],
  igdbPlatformIds: [19, 51, 58],
  applications: [bsnes, snes9x, aresSuperNintendo],
  defaultApplication: aresSuperNintendo,
  hasAnalogStick: false,
};

export const nintendods: Category = {
  id: "nintendods",
  names: ["Nintendo DS", "DS"],
  igdbPlatformIds: [20],
  applications: [melonds, desmume],
  defaultApplication: melonds,
  hasAnalogStick: false,
};

export const nintendo3ds: Category = {
  id: "nintendo3ds",
  names: ["Nintendo 3DS", "3DS"],
  igdbPlatformIds: [37, 137],
  applications: [citra, lime3ds],
  defaultApplication: lime3ds,
  hasAnalogStick: true,
};

export const nintendogamecube: Category = {
  id: "nintendogamecube",
  names: ["Nintendo Gamecube", "Gamecube"],
  igdbPlatformIds: [21],
  applications: [dolphin],
  defaultApplication: dolphin,
  hasAnalogStick: true,
};

export const arcade: Category = {
  id: "arcade",
  names: ["Arcade"],
  igdbPlatformIds: [52],
  applications: [mame],
  defaultApplication: mame,
  hasAnalogStick: false,
};

export const nintendowii: Category = {
  id: "nintendowii",
  names: ["Nintendo Wii", "Wii"],
  igdbPlatformIds: [5],
  applications: [dolphin],
  defaultApplication: dolphin,
  hasAnalogStick: true,
};

export const nintendowiiu: Category = {
  id: "nintendowiiu",
  names: ["Nintendo Wii U", "Wii U", "Nintendo WiiU", "WiiU"],
  igdbPlatformIds: [41],
  applications: [cemu],
  defaultApplication: cemu,
  hasAnalogStick: true,
};

export const nintendoswitch: Category = {
  id: "nintendoswitch",
  names: ["Nintendo Switch", "Switch"],
  igdbPlatformIds: [130],
  applications: [ryujinx, yuzu],
  defaultApplication: ryujinx,
  hasAnalogStick: true,
};

export const nintendoentertainmentsystem: Category = {
  id: "nintendoentertainmentsystem",
  names: ["Nintendo Entertainment System", "NES", "Famicom"],
  igdbPlatformIds: [18, 99],
  applications: [nestopia, punes, mednafen, ares],
  defaultApplication: ares,
  hasAnalogStick: false,
};

export const nintendo64: Category = {
  id: "nintendo64",
  names: ["Nintendo 64", "N64"],
  igdbPlatformIds: [4],
  applications: [ares, rosaliesMupenGui, mupen64plus],
  defaultApplication: ares,
  hasAnalogStick: true,
};

export const nintendogameboy: Category = {
  id: "nintendogameboy",
  names: ["Nintendo Game Boy", "Game Boy", "GB"],
  igdbPlatformIds: [33, 22, 24],
  applications: [mgba, ares],
  defaultApplication: mgba,
  hasAnalogStick: false,
};

export const nintendogameboycolor: Category = {
  id: "nintendogameboycolor",
  names: ["Nintendo Game Boy Color", "Game Boy Color", "GBC"],
  igdbPlatformIds: [22],
  applications: [mgba],
  defaultApplication: mgba,
  hasAnalogStick: false,
};

export const nintendogameboyadvance: Category = {
  id: "nintendogameboyadvance",
  names: ["Nintendo Game Boy Advance", "Game Boy Advance", "GBA"],
  igdbPlatformIds: [24],
  applications: [mgba, ares],
  defaultApplication: mgba,
  hasAnalogStick: false,
};

export const segasaturn: Category = {
  id: "segasaturn",
  names: ["Sega Saturn", "Saturn"],
  igdbPlatformIds: [32],
  applications: [mednafen],
  defaultApplication: mednafen,
  hasAnalogStick: true,
};

export const pcengine: Category = {
  id: "pcengine",
  names: [
    "PC Engine",
    "TurboGrafx-16",
    "TurboGrafx",
    "Turbo Grafx",
    "TurboGrafx 16",
    "Turbo Grafx 16",
    "CoreGrafx",
  ],
  igdbPlatformIds: [86],
  applications: [mednafen, ares],
  defaultApplication: ares,
  hasAnalogStick: false,
};

export const pcenginecd: Category = {
  id: "pcenginecd",
  names: ["PC Engine CD", "TurboGrafx-CD", "TurboGrafx CD"],
  igdbPlatformIds: [150],
  applications: [mednafen],
  defaultApplication: mednafen,
  hasAnalogStick: false,
};

export const pcenginesupergrafx: Category = {
  id: "pcenginesupergrafx",
  names: ["PC Engine SuperGrafx", "SuperGrafx"],
  igdbPlatformIds: [128],
  applications: [mednafen],
  defaultApplication: mednafen,
  hasAnalogStick: false,
};

export const neogeo: Category = {
  id: "neogeo",
  names: ["Neo Geo", "Neo Geo AES", "Neo Geo MVS", "NeoGeo"],
  igdbPlatformIds: [79, 80],
  applications: [mameNeoGeo],
  defaultApplication: mameNeoGeo,
  hasAnalogStick: false,
};

export const neogeocd: Category = {
  id: "neogeocd",
  names: ["Neo Geo CD", "NeoGeo CD"],
  igdbPlatformIds: [136],
  applications: [mameNeoGeoCD],
  defaultApplication: mameNeoGeoCD,
  hasAnalogStick: false,
};

export const neogeopocket: Category = {
  id: "neogeopocket",
  names: ["Neo Geo Pocket", "NeoGeo Pocket"],
  igdbPlatformIds: [119, 120],
  applications: [ares],
  defaultApplication: ares,
  hasAnalogStick: false,
};

export const neogeopocketcolor: Category = {
  id: "neogeopocketcolor",
  names: ["Neo Geo Pocket Color", "NeoGeo Pocket Color"],
  igdbPlatformIds: [120],
  applications: [ares],
  defaultApplication: ares,
  hasAnalogStick: false,
};

export const dos: Category = {
  id: "dos",
  names: ["DOS", "MS DOS", "Microsoft DOS"],
  igdbPlatformIds: [13],
  applications: [dosboxstaging],
  defaultApplication: dosboxstaging,
  hasAnalogStick: false,
};

export const scumm: Category = {
  id: "scumm",
  names: ["Scumm", "Scumm VM", "ScummVM"],
  igdbPlatformIds: [6, 13],
  applications: [scummvm],
  defaultApplication: scummvm,
  hasAnalogStick: true,
};

export const categories = {
  sonyplaystation,
  sonyplaystation2,
  sonyplaystation3,
  sonypsp,
  nintendoentertainmentsystem,
  supernintendo,
  nintendogameboy,
  nintendogameboycolor,
  nintendogameboyadvance,
  nintendods,
  nintendo3ds,
  nintendo64,
  nintendogamecube,
  nintendowii,
  nintendowiiu,
  nintendoswitch,
  pcengine,
  pcenginecd,
  pcenginesupergrafx,
  segamastersystem,
  segagamegear,
  segamegadrive,
  sega32x,
  segacd,
  segasaturn,
  segadreamcast,
  arcade,
  neogeo,
  neogeocd,
  neogeopocket,
  neogeopocketcolor,
  scumm,
  dos,
} satisfies Record<SystemId, Category>;

export const getCategoryDataByName = (name: string) =>
  Object.values(categories).find(
    ({ names }) =>
      !!names.find(
        (categoryName) => categoryName.toLowerCase() === name.toLowerCase(),
      ),
  );
