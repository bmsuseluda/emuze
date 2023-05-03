import type { Application } from "~/server/applicationsDB.server";
import {
  ares,
  blastem,
  bsnes,
  citra,
  desmume,
  dolphin,
  duckstation,
  flycast,
  mame,
  mameNeoGeo,
  mameNeoGeoCD,
  mednafen,
  melonds,
  mgba,
  mupen64Plus,
  nestopia,
  pcsx2,
  play,
  ppsspp,
  snes9x,
} from "~/server/applicationsDB.server";

export interface Category {
  id: PlatformId;
  names: string[];
  igdbPlatformIds: number[];
  applications: Application[];
  defaultApplication: Application;
}

export const sonyplaystation: Category = {
  id: "sonyplaystation",
  names: ["Sony Playstation", "playstation", "psx", "ps1", "psone"],
  igdbPlatformIds: [7],
  applications: [duckstation],
  defaultApplication: duckstation,
};

export const sonyplaystation2: Category = {
  id: "sonyplaystation2",
  names: ["Sony Playstation 2", "playstation 2", "ps2"],
  igdbPlatformIds: [8],
  applications: [pcsx2, play],
  defaultApplication: pcsx2,
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
};

export const segamastersystem: Category = {
  id: "segamastersystem",
  names: ["Sega Master System", "Master System", "SMS"],
  igdbPlatformIds: [64],
  applications: [ares],
  defaultApplication: ares,
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
  applications: [blastem],
  defaultApplication: blastem,
};

export const segacd: Category = {
  id: "segacd",
  names: ["Sega CD", "Mega CD", "Sega Mega CD"],
  igdbPlatformIds: [78],
  applications: [ares],
  defaultApplication: ares,
};

export const segadreamcast: Category = {
  id: "segadreamcast",
  names: ["Sega Dreamcast", "Dreamcast"],
  igdbPlatformIds: [23],
  applications: [flycast],
  defaultApplication: flycast,
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
  applications: [bsnes, snes9x],
  defaultApplication: bsnes,
};

export const nintendods: Category = {
  id: "nintendods",
  names: ["Nintendo DS", "DS"],
  igdbPlatformIds: [20],
  applications: [melonds, desmume],
  defaultApplication: melonds,
};

export const nintendo3ds: Category = {
  id: "nintendo3ds",
  names: ["Nintendo 3DS", "3DS"],
  igdbPlatformIds: [37, 137],
  applications: [citra],
  defaultApplication: citra,
};

export const nintendogamecube: Category = {
  id: "nintendogamecube",
  names: ["Nintendo Gamecube", "Gamecube"],
  igdbPlatformIds: [21],
  applications: [dolphin],
  defaultApplication: dolphin,
};

export const arcade: Category = {
  id: "arcade",
  names: ["Arcade"],
  igdbPlatformIds: [52],
  applications: [mame],
  defaultApplication: mame,
};

export const nintendowii: Category = {
  id: "nintendowii",
  names: ["Nintendo Wii", "Wii"],
  igdbPlatformIds: [5],
  applications: [dolphin],
  defaultApplication: dolphin,
};

export const nintendoentertainmentsystem: Category = {
  id: "nintendoentertainmentsystem",
  names: ["Nintendo Entertainment System", "NES", "Famicom"],
  igdbPlatformIds: [18, 99],
  applications: [nestopia],
  defaultApplication: nestopia,
};

export const nintendo64: Category = {
  id: "nintendo64",
  names: ["Nintendo 64", "N64"],
  igdbPlatformIds: [4],
  applications: [ares, mupen64Plus],
  defaultApplication: ares,
};

export const nintendogameboy: Category = {
  id: "nintendogameboy",
  names: ["Nintendo Game Boy", "Game Boy", "GB"],
  igdbPlatformIds: [33, 22, 24],
  applications: [mgba],
  defaultApplication: mgba,
};

export const nintendogameboycolor: Category = {
  id: "nintendogameboycolor",
  names: ["Nintendo Game Boy Color", "Game Boy Color", "GBC"],
  igdbPlatformIds: [22],
  applications: [mgba],
  defaultApplication: mgba,
};

export const nintendogameboyadvance: Category = {
  id: "nintendogameboyadvance",
  names: ["Nintendo Game Boy Advance", "Game Boy Advance", "GBA"],
  igdbPlatformIds: [24],
  applications: [mgba],
  defaultApplication: mgba,
};

export const segasaturn: Category = {
  id: "segasaturn",
  names: ["Sega Saturn", "Saturn"],
  igdbPlatformIds: [32],
  applications: [mednafen],
  defaultApplication: mednafen,
};

export const pcengine: Category = {
  id: "pcengine",
  names: ["PC Engine"],
  igdbPlatformIds: [86, 150],
  applications: [mednafen],
  defaultApplication: mednafen,
};

export const pcenginecd: Category = {
  id: "pcenginecd",
  names: ["PC Engine CD"],
  igdbPlatformIds: [128, 150],
  applications: [mednafen],
  defaultApplication: mednafen,
};

export const neogeo: Category = {
  id: "neogeo",
  names: ["Neo Geo AES", "Neo Geo MVS", "Neo Geo"],
  igdbPlatformIds: [79, 80],
  applications: [mameNeoGeo],
  defaultApplication: mameNeoGeo,
};

export const neogeocd: Category = {
  id: "neogeocd",
  names: ["Neo Geo CD"],
  igdbPlatformIds: [136],
  applications: [mameNeoGeoCD],
  defaultApplication: mameNeoGeoCD,
};

export type PlatformId = keyof typeof categories;

export const categories = {
  sonyplaystation,
  sonyplaystation2,
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
  pcengine,
  pcenginecd,
  segamastersystem,
  segamegadrive,
  segacd,
  segasaturn,
  segadreamcast,
  arcade,
  neogeo,
  neogeocd,
};

export const getCategoryDataByName = (name: string) =>
  Object.values(categories).find(
    ({ names }) =>
      !!names.find(
        (categoryName) => categoryName.toLowerCase() === name.toLowerCase()
      )
  );
