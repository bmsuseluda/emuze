import { rpcs3 } from "../applicationsDB.server/applications/rpcs3/index.js";
import {
  aresGameBoyAdvance,
  aresGameBoyColor,
  aresGameGear,
  aresMasterSystem,
  aresMegaDrive,
  aresNeoGeoPocket,
  aresNeoGeoPocketColor,
  aresNES,
  aresNintendo64,
  aresPcEngine,
  aresSega32x,
  aresSegaCd,
  aresSegaMegaLd,
  aresSuperGrafx,
  aresSuperNintendo,
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
import { azahar } from "../applicationsDB.server/applications/azahar/index.js";
import { ppsspp } from "../applicationsDB.server/applications/ppsspp/index.js";
import { flycast } from "../applicationsDB.server/applications/flycast/index.js";
import { xemu } from "../applicationsDB.server/applications/xemu/index.js";
import { melonds } from "../applicationsDB.server/applications/melonds/index.js";
import { cemu } from "../applicationsDB.server/applications/cemu/index.js";
import {
  isRmgForN64,
  rosaliesMupenGui,
} from "../applicationsDB.server/applications/rmg/index.js";

export const sonyplaystation: Category = {
  id: "sonyplaystation",
  names: ["Sony PlayStation", "PlayStation", "psx", "ps1", "psone"],
  igdbPlatformIds: [7],
  application: duckstation,
  hasAnalogStick: true,
};

export const sonyplaystation2: Category = {
  id: "sonyplaystation2",
  names: ["Sony PlayStation 2", "PlayStation 2", "ps2"],
  igdbPlatformIds: [8],
  application: pcsx2,
  hasAnalogStick: true,
};

export const sonyplaystation3: Category = {
  id: "sonyplaystation3",
  names: ["Sony PlayStation 3", "PlayStation 3", "ps3"],
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
  application: aresMasterSystem,
  hasAnalogStick: false,
};

export const segagamegear: Category = {
  id: "segagamegear",
  names: ["Sega Game Gear", "Game Gear", "gg", "sgg"],
  igdbPlatformIds: [35],
  application: aresGameGear,
  hasAnalogStick: false,
};

export const segamegadrive: Category = {
  id: "segamegadrive",
  names: ["Sega Mega Drive", "Mega Drive", "Sega Genesis", "Genesis", "smd"],
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
  names: ["Sega CD", "Mega CD", "Sega Mega CD", "smcd"],
  igdbPlatformIds: [78],
  application: aresSegaCd,
  hasAnalogStick: false,
};

export const segamegald: Category = {
  id: "segamegald",
  names: [
    "Mega LD",
    "Sega Mega LD",
    "LaserActive Mega LD",
    "LaserActive Sega PAC",
    "Pioneer LaserActive Mega LD",
    "Pioneer LaserActive Sega PAC",
  ],
  igdbPlatformIds: [487],
  application: aresSegaMegaLd,
  hasAnalogStick: false,
};

export const segadreamcast: Category = {
  id: "segadreamcast",
  names: ["Sega Dreamcast", "Dreamcast", "dc"],
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
    "sfc",
  ],
  igdbPlatformIds: [19, /** Super Famicom */ 58],
  application: aresSuperNintendo,
  hasAnalogStick: false,
};

export const nintendods: Category = {
  id: "nintendods",
  names: ["Nintendo DS", "DS", "nds"],
  igdbPlatformIds: [20],
  application: melonds,
  hasAnalogStick: false,
};

export const nintendo3ds: Category = {
  id: "nintendo3ds",
  names: ["Nintendo 3DS", "3DS", "n3ds"],
  igdbPlatformIds: [37, /** New Nintendo 3DS */ 137],
  application: azahar,
  hasAnalogStick: true,
};

export const nintendogamecube: Category = {
  id: "nintendogamecube",
  names: ["Nintendo GameCube", "GameCube", "ngc", "gc"],
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
  names: ["Nintendo Wii U", "Wii U"],
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
  names: [
    "Nintendo Entertainment System",
    "NES",
    "Famicom",
    "Family Computer",
    "fc",
  ],
  igdbPlatformIds: [18, /** Famicom Disc System */ 51, /** Famicom */ 99],
  application: aresNES,
  hasAnalogStick: false,
};

export const nintendo64: Category = {
  id: "nintendo64",
  names: ["Nintendo 64", "N64"],
  igdbPlatformIds: [4],
  application: isRmgForN64() ? rosaliesMupenGui : aresNintendo64,
  hasAnalogStick: true,
};

export const nintendogameboy: Category = {
  id: "nintendogameboy",
  names: ["Nintendo Game Boy", "Game Boy", "GB"],
  igdbPlatformIds: [33],
  application: aresGameBoyColor,
  hasAnalogStick: false,
};

export const nintendogameboycolor: Category = {
  id: "nintendogameboycolor",
  names: ["Nintendo Game Boy Color", "Game Boy Color", "GBC"],
  igdbPlatformIds: [22],
  application: aresGameBoyColor,
  hasAnalogStick: false,
};

export const nintendogameboyadvance: Category = {
  id: "nintendogameboyadvance",
  names: ["Nintendo Game Boy Advance", "Game Boy Advance", "GBA"],
  igdbPlatformIds: [24],
  application: aresGameBoyAdvance,
  hasAnalogStick: false,
};

export const segasaturn: Category = {
  id: "segasaturn",
  names: ["Sega Saturn", "Saturn", "ss"],
  igdbPlatformIds: [32],
  application: mednafenSaturn,
  hasAnalogStick: true,
};

export const pcengine: Category = {
  id: "pcengine",
  names: [
    "NEC PC Engine",
    "PC Engine",
    "Turbo Grafx",
    "Turbo Grafx 16",
    "NEC Turbo Grafx 16",
    "CoreGrafx",
    "pce",
  ],
  igdbPlatformIds: [86],
  application: aresPcEngine,
  hasAnalogStick: false,
};

export const pcenginecd: Category = {
  id: "pcenginecd",
  names: [
    "NEC PC Engine CD",
    "PC Engine CD",
    "NEC Turbo Grafx CD",
    "Turbo Grafx CD",
    "pcecd",
  ],
  igdbPlatformIds: [150],
  application: mednafenPcEngineCD,
  hasAnalogStick: false,
};

export const pcenginesupergrafx: Category = {
  id: "pcenginesupergrafx",
  names: [
    "NEC PC Engine SuperGrafx",
    "PC Engine SuperGrafx",
    "NEC Super Grafx",
    "Super Grafx",
    "pcfx",
  ],
  igdbPlatformIds: [128],
  application: aresSuperGrafx,
  hasAnalogStick: false,
};

export const neogeo: Category = {
  id: "neogeo",
  names: [
    "SNK Neo Geo",
    "Neo Geo",
    "SNK Neo Geo AES",
    "Neo Geo AES",
    "SNK Neo Geo MVS",
    "Neo Geo MVS",
    "ng",
    "aes",
    "mvs",
  ],
  igdbPlatformIds: [79, 80],
  application: mameNeoGeo,
  hasAnalogStick: false,
};

export const neogeocd: Category = {
  id: "neogeocd",
  names: ["SNK Neo Geo CD", "Neo Geo CD", "ngcd"],
  igdbPlatformIds: [136],
  application: mameNeoGeoCD,
  hasAnalogStick: false,
};

export const neogeopocket: Category = {
  id: "neogeopocket",
  names: ["SNK Neo Geo Pocket", "Neo Geo Pocket", "ngp"],
  igdbPlatformIds: [119],
  application: aresNeoGeoPocket,
  hasAnalogStick: false,
};

export const neogeopocketcolor: Category = {
  id: "neogeopocketcolor",
  names: ["SNK Neo Geo Pocket Color", "Neo Geo Pocket Color", "ngpc"],
  igdbPlatformIds: [120],
  application: aresNeoGeoPocketColor,
  hasAnalogStick: false,
};

export const dos: Category = {
  id: "dos",
  names: ["Microsoft DOS", "DOS", "MS DOS"],
  igdbPlatformIds: [13],
  application: dosboxstaging,
  hasAnalogStick: false,
};

export const scumm: Category = {
  id: "scumm",
  names: ["Scumm", "Scumm VM"],
  igdbPlatformIds: [/** PC */ 6, /** Dos */ 13],
  application: scummvm,
  hasAnalogStick: true,
};

export const xbox: Category = {
  id: "xbox",
  names: ["Microsoft XBOX", "XBOX"],
  igdbPlatformIds: [11],
  application: xemu,
  hasAnalogStick: true,
};

/**
 * This is not a real Category, it is just for convenience part of the categories.
 */
export const lastPlayed: Category = {
  id: "lastPlayed",
  names: ["Last Played"],
  igdbPlatformIds: [],
  application: aresPcEngine,
  hasAnalogStick: true,
};

export const categories = {
  segamastersystem,
  segagamegear,
  segamegadrive,
  sega32x,
  segacd,
  segamegald,
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
  xbox,
  lastPlayed,
} satisfies Record<SystemId, Category>;

const normalizeString = (a: string) =>
  a
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll(/[`~!@#$%^&*()_|+\-=?;:'",.]/gi, "");

export const getCategoryDataByName = (name: string) =>
  Object.values(categories).find(
    ({ names }) =>
      !!names.find(
        (categoryName) =>
          normalizeString(categoryName) === normalizeString(name),
      ),
  );
