import nodepath from "path";

import type { Category as CategoryData, Entry } from "~/types/category";
import type { Category } from "~/server/categoriesDB.server";
import {
  arcade,
  neogeo,
  neogeocd,
  nintendo3ds,
  nintendo64,
  nintendods,
  nintendoentertainmentsystem,
  nintendogameboy,
  nintendogameboyadvance,
  nintendogameboycolor,
  nintendogamecube,
  nintendowii,
  pcengine,
  pcenginecd,
  segacd,
  segadreamcast,
  segamastersystem,
  segamegadrive,
  segasaturn,
  sonyplaystation,
  sonyplaystation2,
  sonypsp,
  supernintendo,
} from "~/server/categoriesDB.server";
import type { General } from "~/types/settings/general";
import type { Appearance } from "~/types/settings/appearance";
import neogeoGames from "~/server/mameMappings/neogeoMapping.json";
import arcadeGames from "~/server/mameMappings/arcadeMapping.json";

type Settings = {
  general: General;
  appearance: Appearance;
};

type OptionParamFunction = (entry: Entry, settings: Settings) => string[];
type EnvironmentVariableFunction = (
  category: CategoryData,
  settings: Settings
) => Record<string, string | null>;

type FindEntryNameFunction = (entry: Entry, categoryPath: string) => string;

const mameRegionChars = ["j", "a", "u", "b", "k", "w", "c"];

export const findEntryNameByFolder: FindEntryNameFunction = (
  { name, path },
  categoryPath
) => {
  const entryFolderPath = nodepath.dirname(path);
  if (categoryPath !== entryFolderPath) {
    const entryNameByFolder = nodepath.dirname(path).split(nodepath.sep).at(-1);
    if (entryNameByFolder) {
      return entryNameByFolder;
    }
  }
  return name;
};

// TODO: add tests
export const findArcadeName: FindEntryNameFunction = ({ id }) => {
  const entry = arcadeGames.find(
    ({ name }) =>
      name === id ||
      mameRegionChars.find(
        (mameRegionChar) => `${name}${mameRegionChar}` === id
      )
  );

  return entry?.description || id;
};

export interface Application {
  id: string;
  name: string;
  fileExtensions: string[];
  categories: Category[];
  environmentVariables?: EnvironmentVariableFunction;
  optionParams?: OptionParamFunction;
  flatpakId?: string;
  flatpakOptionParams?: string[];
  findEntryName?: FindEntryNameFunction;
  filteredFiles?: string[];
}

export const pcsx2: Application = {
  id: "pcsx2",
  name: "PCSX2",
  fileExtensions: [".chd", ".iso"],
  categories: [sonyplaystation2],
  flatpakId: "net.pcsx2.PCSX2",
  flatpakOptionParams: ["--command=pcsx2-qt"],
  optionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
    }
    return optionParams;
  },
};

export const blastem: Application = {
  id: "blastem",
  name: "BlastEm",
  fileExtensions: [".68K", ".bin", ".sgd", ".smd"],
  categories: [segamegadrive],
  flatpakId: "com.retrodev.blastem",
  optionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-f");
    }
    return optionParams;
  },
};

export const bsnes: Application = {
  id: "bsnes",
  name: "BSNES",
  fileExtensions: [".sfc", ".smc"],
  categories: [supernintendo],
  flatpakId: "dev.bsnes.bsnes",
  optionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

const getSharedMameSettings = (entryDirname: string) => [
  "-w",
  "-rompath",
  entryDirname,
  "-cfg_directory",
  nodepath.join(entryDirname, "cfg"),
  "-nvram_directory",
  nodepath.join(entryDirname, "nvram"),
];

export const applications: Application[] = [
  {
    id: "duckstation",
    name: "Duckstation",
    fileExtensions: [".chd", ".cue"],
    categories: [sonyplaystation],
    flatpakId: "org.duckstation.DuckStation",
    optionParams: (_, { appearance: { fullscreen } }) => {
      const optionParams = [];
      if (fullscreen) {
        optionParams.push("-fullscreen");
      }
      return optionParams;
    },
  },
  pcsx2,
  {
    id: "play",
    name: "Play",
    fileExtensions: [".iso"],
    categories: [sonyplaystation2],
    flatpakId: "org.purei.Play",
  },
  {
    id: "ppsspp",
    name: "PPSSPP",
    fileExtensions: [".cso", ".iso"],
    categories: [sonypsp],
    flatpakId: "org.ppsspp.PPSSPP",
  },
  blastem,
  bsnes,
  {
    id: "snes9x",
    name: "Snes9x",
    fileExtensions: [".sfc", ".smc"],
    categories: [supernintendo],
    flatpakId: "com.snes9x.Snes9x",
  },
  {
    id: "citra",
    name: "Citra",
    fileExtensions: [".3ds"],
    categories: [nintendo3ds],
    flatpakId: "org.citra_emu.citra",
  },
  {
    id: "melonds",
    name: "MelonDS",
    fileExtensions: [".nds"],
    categories: [nintendods],
    flatpakId: "net.kuribo64.melonDS",
  },
  {
    id: "desmume",
    name: "DeSmuME",
    fileExtensions: [".nds"],
    categories: [nintendods],
    flatpakId: "org.desmume.DeSmuME",
  },
  {
    id: "dolphin",
    name: "Dolphin",
    fileExtensions: [".iso"],
    categories: [nintendogamecube, nintendowii],
    flatpakId: "org.DolphinEmu.dolphin-emu",
  },
  {
    id: "mesen",
    name: "Mesen",
    fileExtensions: [".nes"],
    categories: [nintendoentertainmentsystem],
  },
  {
    id: "nestopia",
    name: "Nestopia",
    fileExtensions: [".nes"],
    categories: [nintendoentertainmentsystem],
    flatpakId: "ca._0ldsk00l.Nestopia",
  },
  {
    id: "mednafen",
    name: "Mednafen",
    fileExtensions: [".cue", ".pce"],
    categories: [segasaturn, pcengine, pcenginecd],
    flatpakId: "com.github.AmatCoder.mednaffe",
    flatpakOptionParams: ["--command=mednafen"],
    environmentVariables: ({ applicationPath }, { general: { isWindows } }) => {
      const environmentVariables = {};
      if (isWindows && applicationPath) {
        return {
          ...environmentVariables,
          MEDNAFEN_HOME: nodepath.dirname(applicationPath),
        };
      }
      return environmentVariables;
    },
  },
  {
    id: "mame",
    name: "Mame",
    fileExtensions: [".zip", ".chd"],
    categories: [arcade],
    flatpakId: "org.mamedev.MAME",
    optionParams: ({ path }) => {
      const entryDirname = nodepath.dirname(path);
      return [...getSharedMameSettings(entryDirname)];
    },
    findEntryName: findArcadeName,
  },
  {
    id: "mameneogeo",
    name: "Mame",
    fileExtensions: [".zip", ".chd"],
    categories: [neogeo],
    flatpakId: "org.mamedev.MAME",
    optionParams: ({ path }) => {
      const entryDirname = nodepath.dirname(path);
      return [...getSharedMameSettings(entryDirname)];
    },
    findEntryName: ({ id }) => {
      // @ts-ignore TODO: check how to type this
      const entryName = neogeoGames[id];
      return entryName || id;
    },
    filteredFiles: ["neogeo.zip"],
  },
  {
    id: "mameneogeocd",
    name: "Mame",
    fileExtensions: [".zip", ".chd"],
    // mame needs specific option params for neogeo cd, therefore it is a specific config of mame
    categories: [neogeocd],
    flatpakId: "org.mamedev.MAME",
    optionParams: ({ path }) => {
      const entryDirname = nodepath.dirname(path);
      return [...getSharedMameSettings(entryDirname), "neocdz", "-cdrm"];
    },
    filteredFiles: ["neocdz.zip"],
  },
  {
    id: "ares",
    name: "Ares",
    fileExtensions: [".z64", ".sms", ".chd"],
    categories: [nintendo64, segamastersystem, segacd],
    flatpakId: "dev.ares.ares",
  },
  {
    id: "mupen64plus",
    name: "Mupen64Plus",
    fileExtensions: [".z64"],
    categories: [nintendo64],
    flatpakId: "io.github.m64p.m64p",
  },
  {
    id: "visualboyadvance",
    name: "Visual Boy Advance",
    fileExtensions: [".gb", ".gba"],
    categories: [nintendogameboy, nintendogameboycolor, nintendogameboyadvance],
  },
  {
    id: "mgba",
    name: "mgba",
    fileExtensions: [".gb", ".gba"],
    categories: [nintendogameboy, nintendogameboycolor, nintendogameboyadvance],
    flatpakId: "io.mgba.mGBA",
  },
  {
    id: "redream",
    name: "Redream",
    fileExtensions: [".cue", ".chd"],
    categories: [segadreamcast],
  },
  {
    id: "flycast",
    name: "Flycast",
    fileExtensions: [".cue", ".chd"],
    categories: [segadreamcast],
    flatpakId: "org.flycast.Flycast",
  },
];

export const getApplicationDataByName = (name: string) =>
  applications.find(({ id }) => name.toLowerCase().includes(id.toLowerCase()));

export const getApplicationDataById = (id: string) =>
  applications.find(
    (application) => application.id.toLowerCase() === id.toLowerCase()
  );
