import {
  cemu,
  flycast,
  lime3ds,
  melonds,
  mgba,
  rosaliesMupenGui,
} from "../applicationsDB.server/index.js";
import { rpcs3 } from "../applicationsDB.server/applications/rpcs3/index.js";
import {
  ares,
  aresGameBoyColor,
  aresMegaDrive,
  aresSega32x,
  aresSegaCd,
  aresSuperGrafx,
  aresSuperNintendo,
  isMgbaForGameBoy,
  isRmgForN64,
} from "../applicationsDB.server/applications/ares/index.js";
import {
  mame,
  mameNeoGeo,
  mameNeoGeoCD,
} from "../applicationsDB.server/applications/mame/index.js";
import { dosboxstaging } from "../applicationsDB.server/applications/dosbox/index.js";
import { scummvm } from "../applicationsDB.server/applications/scummvm/index.js";
import type { Category } from "./types.js";
import type { SystemId } from "./systemId.js";
import { duckstation } from "../applicationsDB.server/applications/duckstation/index.js";
import { pcsx2 } from "../applicationsDB.server/applications/pcsx2/index.js";
import { ryujinx } from "../applicationsDB.server/applications/ryujinx/index.js";
import { dolphin } from "../applicationsDB.server/applications/dolphin/index.js";
import {
  mednafenPcEngineCD,
  mednafenSaturn,
} from "../applicationsDB.server/applications/mednafen/index.js";
import {
  azahar,
  isLime3dsFor3ds,
} from "../applicationsDB.server/applications/azahar/index.js";
import { ppsspp } from "../applicationsDB.server/applications/ppsspp/index.js";

export const sonyplaystation: Category = {
  id: "sonyplaystation",
  names: ["Sony PlayStation", "playstation", "psx", "ps1", "psone"],
  igdbPlatformIds: [7],
  application: duckstation,
  hasAnalogStick: true,
};

export const sonyplaystation2: Category = {
  id: "sonyplaystation2",
  names: ["Sony PlayStation 2", "playstation 2", "ps2"],
  igdbPlatformIds: [8],
  application: pcsx2,
  hasAnalogStick: true,
};

export const sonyplaystation3: Category = {
  id: "sonyplaystation3",
  names: ["Sony PlayStation 3", "playstation 3", "ps3"],
  igdbPlatformIds: [9],
  application: rpcs3,
  hasAnalogStick: true,
};

export const sonypsp: Category = {
  id: "sonypsp",
  names: [
    "Sony PlayStation Portable",
    "PlayStation Portable",
    "Sony PSP",
    "PSP",
  ],
  igdbPlatformIds: [38],
  application: ppsspp,
  hasAnalogStick: true,
};

export const segamastersystem: Category = {
  id: "segamastersystem",
  names: ["Sega Master System", "Master System", "SMS"],
  igdbPlatformIds: [64],
  application: ares,
  hasAnalogStick: false,
};

export const segagamegear: Category = {
  id: "segagamegear",
  names: ["Sega Game Gear", "Game Gear", "GameGear"],
  igdbPlatformIds: [35],
  application: ares,
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
  application: aresMegaDrive,
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
  application: aresSega32x,
  hasAnalogStick: false,
};

export const segacd: Category = {
  id: "segacd",
  names: ["Sega CD", "Mega CD", "Sega Mega CD"],
  igdbPlatformIds: [78],
  application: aresSegaCd,
  hasAnalogStick: false,
};

export const segadreamcast: Category = {
  id: "segadreamcast",
  names: ["Sega Dreamcast", "Dreamcast"],
  igdbPlatformIds: [23],
  application: flycast,
  hasAnalogStick: true,
};

export const supernintendo: Category = {
  id: "supernintendo",
  names: [
    "Super Nintendo Entertainment System",
    "Super Nintendo",
    "SNES",
    "Super Famicom",
    "Super Family Computer",
  ],
  igdbPlatformIds: [19, /** Super Famicom */ 58],
  application: aresSuperNintendo,
  hasAnalogStick: false,
};

export const nintendods: Category = {
  id: "nintendods",
  names: ["Nintendo DS", "DS"],
  igdbPlatformIds: [20],
  application: melonds,
  hasAnalogStick: false,
};

export const nintendo3ds: Category = {
  id: "nintendo3ds",
  names: ["Nintendo 3DS", "3DS"],
  igdbPlatformIds: [37, /** New Nintendo 3DS */ 137],
  application: isLime3dsFor3ds() ? lime3ds : azahar,
  hasAnalogStick: true,
};

export const nintendogamecube: Category = {
  id: "nintendogamecube",
  names: ["Nintendo Gamecube", "Gamecube"],
  igdbPlatformIds: [21],
  application: dolphin,
  hasAnalogStick: true,
};

export const arcade: Category = {
  id: "arcade",
  names: ["Arcade"],
  igdbPlatformIds: [52],
  application: mame,
  hasAnalogStick: false,
};

export const nintendowii: Category = {
  id: "nintendowii",
  names: ["Nintendo Wii", "Wii"],
  igdbPlatformIds: [5],
  application: dolphin,
  hasAnalogStick: true,
};

export const nintendowiiu: Category = {
  id: "nintendowiiu",
  names: ["Nintendo Wii U", "Wii U", "Nintendo WiiU", "WiiU"],
  igdbPlatformIds: [41],
  application: cemu,
  hasAnalogStick: true,
};

export const nintendoswitch: Category = {
  id: "nintendoswitch",
  names: ["Nintendo Switch", "Switch"],
  igdbPlatformIds: [130],
  application: ryujinx,
  hasAnalogStick: true,
};

export const nintendoentertainmentsystem: Category = {
  id: "nintendoentertainmentsystem",
  names: ["Nintendo Entertainment System", "NES", "Famicom", "Family Computer"],
  igdbPlatformIds: [18, /** Famicom Disc System */ 51, /** Famicom */ 99],
  application: ares,
  hasAnalogStick: false,
};

export const nintendo64: Category = {
  id: "nintendo64",
  names: ["Nintendo 64", "N64"],
  igdbPlatformIds: [4],
  application: isRmgForN64() ? rosaliesMupenGui : ares,
  hasAnalogStick: true,
};

export const nintendogameboy: Category = {
  id: "nintendogameboy",
  names: ["Nintendo Game Boy", "Game Boy", "GB"],
  igdbPlatformIds: [33],
  application: isMgbaForGameBoy() ? mgba : aresGameBoyColor,
  hasAnalogStick: false,
};

export const nintendogameboycolor: Category = {
  id: "nintendogameboycolor",
  names: ["Nintendo Game Boy Color", "Game Boy Color", "GBC"],
  igdbPlatformIds: [22],
  application: isMgbaForGameBoy() ? mgba : aresGameBoyColor,
  hasAnalogStick: false,
};

export const nintendogameboyadvance: Category = {
  id: "nintendogameboyadvance",
  names: ["Nintendo Game Boy Advance", "Game Boy Advance", "GBA"],
  igdbPlatformIds: [24],
  application: isMgbaForGameBoy() ? mgba : ares,
  hasAnalogStick: false,
};

export const segasaturn: Category = {
  id: "segasaturn",
  names: ["Sega Saturn", "Saturn"],
  igdbPlatformIds: [32],
  application: mednafenSaturn,
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
  application: ares,
  hasAnalogStick: false,
};

export const pcenginecd: Category = {
  id: "pcenginecd",
  names: ["PC Engine CD", "TurboGrafx-CD", "TurboGrafx CD"],
  igdbPlatformIds: [150],
  application: mednafenPcEngineCD,
  hasAnalogStick: false,
};

export const pcenginesupergrafx: Category = {
  id: "pcenginesupergrafx",
  names: ["PC Engine SuperGrafx", "SuperGrafx", "Super Grafx"],
  igdbPlatformIds: [128],
  application: aresSuperGrafx,
  hasAnalogStick: false,
};

export const neogeo: Category = {
  id: "neogeo",
  names: ["Neo Geo", "Neo Geo AES", "Neo Geo MVS", "NeoGeo"],
  igdbPlatformIds: [79, 80],
  application: mameNeoGeo,
  hasAnalogStick: false,
};

export const neogeocd: Category = {
  id: "neogeocd",
  names: ["Neo Geo CD", "NeoGeo CD"],
  igdbPlatformIds: [136],
  application: mameNeoGeoCD,
  hasAnalogStick: false,
};

export const neogeopocket: Category = {
  id: "neogeopocket",
  names: ["Neo Geo Pocket", "NeoGeo Pocket"],
  igdbPlatformIds: [119],
  application: ares,
  hasAnalogStick: false,
};

export const neogeopocketcolor: Category = {
  id: "neogeopocketcolor",
  names: ["Neo Geo Pocket Color", "NeoGeo Pocket Color"],
  igdbPlatformIds: [120],
  application: ares,
  hasAnalogStick: false,
};

export const dos: Category = {
  id: "dos",
  names: ["DOS", "MS DOS", "Microsoft DOS"],
  igdbPlatformIds: [13],
  application: dosboxstaging,
  hasAnalogStick: false,
};

export const scumm: Category = {
  id: "scumm",
  names: ["Scumm", "Scumm VM", "ScummVM"],
  igdbPlatformIds: [/** PC */ 6, /** Dos */ 13],
  application: scummvm,
  hasAnalogStick: true,
};

/**
 * This is not a real Category, it is just for convenience part of the categories.
 */
export const lastPlayed: Category = {
  id: "lastPlayed",
  names: ["Last Played"],
  igdbPlatformIds: [],
  application: ares,
  hasAnalogStick: true,
};

export const categories = {
  segamastersystem,
  segagamegear,
  segamegadrive,
  sega32x,
  segacd,
  segasaturn,
  segadreamcast,
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
  sonyplaystation,
  sonyplaystation2,
  sonyplaystation3,
  sonypsp,
  pcengine,
  pcenginecd,
  pcenginesupergrafx,
  arcade,
  neogeo,
  neogeocd,
  neogeopocket,
  neogeopocketcolor,
  scumm,
  dos,
  lastPlayed,
} satisfies Record<SystemId, Category>;

export const getCategoryDataByName = (name: string) =>
  Object.values(categories).find(
    ({ names }) =>
      !!names.find(
        (categoryName) => categoryName.toLowerCase() === name.toLowerCase(),
      ),
  );
