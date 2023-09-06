import nodepath from "path";

import type {
  Category as CategoryData,
  Entry,
} from "~/types/jsonFiles/category";
import type { General } from "~/types/jsonFiles/settings/general";
import type { Appearance } from "~/types/jsonFiles/settings/appearance";
import mameGames from "~/server/mameMappings/mameMapping.json";

type Settings = {
  general: General;
  appearance: Appearance;
};

type OptionParamFunction = (entry: Entry, settings: Settings) => string[];
type EnvironmentVariableFunction = (
  category: CategoryData,
  settings: Settings,
) => Record<string, string | null>;

type FindEntryNameFunction = (entry: Entry, categoryPath: string) => string;

export const findEntryNameByFolder: FindEntryNameFunction = (
  { name, path },
  categoryPath,
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

export interface Application {
  id: ApplicationId;
  name: string;
  fileExtensions: string[];
  environmentVariables?: EnvironmentVariableFunction;
  createOptionParams?: OptionParamFunction;
  flatpakId: string;
  flatpakOptionParams?: string[];
  findEntryName?: FindEntryNameFunction;
  filteredFiles?: string[];
}

export const pcsx2: Application = {
  id: "pcsx2",
  name: "PCSX2",
  fileExtensions: [".chd", ".iso"],
  flatpakId: "net.pcsx2.PCSX2",
  flatpakOptionParams: ["--command=pcsx2-qt"],
  createOptionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
      optionParams.push("-bigpicture");
      optionParams.push("-batch");
    }
    return optionParams;
  },
};

export const blastem: Application = {
  id: "blastem",
  name: "BlastEm",
  fileExtensions: [".68K", ".bin", ".sgd", ".smd"],
  flatpakId: "com.retrodev.blastem",
  createOptionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
    }
    return optionParams;
  },
};

export const bsnes: Application = {
  id: "bsnes",
  name: "BSNES",
  fileExtensions: [".sfc", ".smc"],
  flatpakId: "dev.bsnes.bsnes",
  createOptionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

const findMameArcadeGameName: FindEntryNameFunction = ({ name }) => {
  // @ts-ignore TODO: check how to type this
  const entryName = mameGames[name];
  return entryName || name;
};

export const mame: Application = {
  id: "mame",
  name: "Mame",
  fileExtensions: [".zip", ".chd"],
  flatpakId: "org.mamedev.MAME",
  createOptionParams: ({ path }) => {
    const entryDirname = nodepath.dirname(path);
    return [...getSharedMameOptionParams(entryDirname)];
  },
  findEntryName: findMameArcadeGameName,
};

export const mameNeoGeo: Application = {
  ...mame,
  id: "mameNeoGeo",
  filteredFiles: ["neogeo.zip"],
};

export const mameNeoGeoCD: Application = {
  ...mame,
  id: "mameNeoGeoCD",
  createOptionParams: ({ path }) => {
    const entryDirname = nodepath.dirname(path);
    return [...getSharedMameOptionParams(entryDirname), "neocdz", "-cdrm"];
  },
  filteredFiles: ["neocdz.zip"],
  findEntryName: undefined,
};

const getSharedMameOptionParams = (entryDirname: string) => [
  "-w",
  "-rompath",
  entryDirname,
  "-cfg_directory",
  nodepath.join(entryDirname, "cfg"),
  "-nvram_directory",
  nodepath.join(entryDirname, "nvram"),
];

export const duckstation: Application = {
  id: "duckstation",
  name: "Duckstation",
  fileExtensions: [".chd", ".cue"],
  flatpakId: "org.duckstation.DuckStation",
  createOptionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
      optionParams.push("-bigpicture");
      optionParams.push("-batch");
    }
    return optionParams;
  },
};

export const play: Application = {
  id: "play",
  name: "Play",
  fileExtensions: [".iso", ".chd"],
  flatpakId: "org.purei.Play",
};

export const ppsspp: Application = {
  id: "ppsspp",
  name: "PPSSPP",
  fileExtensions: [".cso", ".iso"],
  flatpakId: "org.ppsspp.PPSSPP",
  createOptionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

export const snes9x: Application = {
  id: "snes9x",
  name: "Snes9x",
  fileExtensions: [".sfc", ".smc"],
  flatpakId: "com.snes9x.Snes9x",
};

export const citra: Application = {
  id: "citra",
  name: "Citra",
  fileExtensions: [".3ds"],
  flatpakId: "org.citra_emu.citra",
};

export const melonds: Application = {
  id: "melonds",
  name: "MelonDS",
  fileExtensions: [".nds"],
  flatpakId: "net.kuribo64.melonDS",
  createOptionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

export const desmume: Application = {
  id: "desmume",
  name: "DeSmuME",
  fileExtensions: [".nds"],
  flatpakId: "org.desmume.DeSmuME",
};

export const dolphin: Application = {
  id: "dolphin",
  name: "Dolphin",
  fileExtensions: [".iso"],
  flatpakId: "org.DolphinEmu.dolphin-emu",
};

export const nestopia: Application = {
  id: "nestopia",
  name: "Nestopia",
  fileExtensions: [".nes"],
  flatpakId: "ca._0ldsk00l.Nestopia",
};

export const mednafen: Application = {
  id: "mednafen",
  name: "Mednafen",
  fileExtensions: [".cue", ".pce"],
  flatpakId: "com.github.AmatCoder.mednaffe",
  flatpakOptionParams: ["--command=mednafen"],
  environmentVariables: ({ application }, { general: { isWindows } }) => {
    const environmentVariables = {};
    if (isWindows && application?.path) {
      return {
        ...environmentVariables,
        MEDNAFEN_HOME: nodepath.dirname(application.path),
      };
    }
    return environmentVariables;
  },
};

export const ares: Application = {
  id: "ares",
  name: "Ares",
  fileExtensions: [
    ".z64",
    ".sms",
    ".chd",
    ".nes",
    ".sfc",
    ".smc",
    ".68K",
    ".bin",
    ".sgd",
    ".smd",
    ".gb",
    ".gba",
    ".cue",
    ".pce",
  ],
  flatpakId: "dev.ares.ares",
  createOptionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

export const mupen64plus: Application = {
  id: "mupen64plus",
  name: "Mupen64Plus",
  fileExtensions: [".z64"],
  flatpakId: "io.github.simple64.simple64",
};

export const mgba: Application = {
  id: "mgba",
  name: "mgba",
  fileExtensions: [".gb", ".gba"],
  flatpakId: "io.mgba.mGBA",
  createOptionParams: (_, { appearance: { fullscreen } }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
    }
    return optionParams;
  },
};

export const flycast: Application = {
  id: "flycast",
  name: "Flycast",
  fileExtensions: [".cue", ".chd"],
  flatpakId: "org.flycast.Flycast",
};

export type ApplicationId = keyof typeof applications;

export const applications = {
  duckstation,
  pcsx2,
  play,
  ppsspp,
  blastem,
  bsnes,
  snes9x,
  citra,
  melonds,
  desmume,
  dolphin,
  nestopia,
  mednafen,
  mame,
  mameNeoGeo,
  mameNeoGeoCD,
  ares,
  mupen64plus,
  mgba,
  flycast,
} satisfies Record<string, Application>;

export const getApplicationDataByName = (name: string) =>
  Object.values(applications).find(({ id }) =>
    name.toLowerCase().includes(id.toLowerCase()),
  );

export const getApplicationDataById = (id: ApplicationId) =>
  Object.values(applications).find(
    (application) => application.id.toLowerCase() === id.toLowerCase(),
  );
