import nodepath from "path";

import type { Category, Entry } from "~/types/jsonFiles/category";
import type { GeneralConfigured } from "~/types/jsonFiles/settings/general";
import type { Appearance } from "~/types/jsonFiles/settings/appearance";
import mameGames from "~/server/mameMappings/mameMapping.json";

type Settings = {
  general: GeneralConfigured;
  appearance: Appearance;
};

type OptionParamFunction = ({
  entryData,
  categoryData,
  settings,
}: {
  entryData: Entry;
  categoryData: Category;
  settings: Settings;
}) => string[];
type EnvironmentVariableFunction = (
  category: Category,
  settings: Settings,
) => Record<string, string | null>;

type FindEntryNameFunction = (entry: Entry, categoryPath: string) => string;

export interface Application {
  id: ApplicationId;
  name: string;
  fileExtensions: `.${string}`[];
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
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
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
  fileExtensions: [".68K", ".bin", ".sgd", ".smd", ".sms", ".gg"],
  flatpakId: "com.retrodev.blastem",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
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
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

const findMameArcadeGameName: FindEntryNameFunction = ({ name }) => {
  let entryName: string;
  try {
    entryName = (mameGames as Record<string, string>)[name];
  } catch (error) {
    console.log("findMameArcadeGameName", error);
    return name;
  }

  return entryName || name;
};

const getSharedMameOptionParams: OptionParamFunction = ({
  categoryData: { name },
  settings: {
    general: { categoriesPath },
  },
}) => {
  const entryDirname = nodepath.join(categoriesPath, name);
  return [
    "-w",
    "-rompath",
    entryDirname,
    "-cfg_directory",
    nodepath.join(entryDirname, "cfg"),
    "-nvram_directory",
    nodepath.join(entryDirname, "nvram"),
  ];
};

export const mame: Application = {
  id: "mame",
  name: "Mame",
  fileExtensions: [".zip", ".chd"],
  flatpakId: "org.mamedev.MAME",
  createOptionParams: getSharedMameOptionParams,
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
  createOptionParams: (...props) => [
    ...getSharedMameOptionParams(...props),
    "neocdz",
    "-cdrm",
  ],
  filteredFiles: ["neocdz.zip"],
  findEntryName: undefined,
};

export const duckstation: Application = {
  id: "duckstation",
  name: "DuckStation",
  fileExtensions: [".chd", ".cue"],
  flatpakId: "org.duckstation.DuckStation",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
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
  name: "Play!",
  fileExtensions: [".iso", ".chd"],
  flatpakId: "org.purei.Play",
};

export const ppsspp: Application = {
  id: "ppsspp",
  name: "PPSSPP",
  fileExtensions: [".chd", ".cso", ".iso"],
  flatpakId: "org.ppsspp.PPSSPP",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--pause-menu-exit");
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
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
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
  fileExtensions: [".iso", ".rvz"],
  flatpakId: "org.DolphinEmu.dolphin-emu",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--config");
      optionParams.push("Dolphin.Display.Fullscreen=True");
    }
    optionParams.push("--batch");
    return optionParams;
  },
};

export const nestopia: Application = {
  id: "nestopia",
  name: "Nestopia",
  fileExtensions: [".nes"],
  flatpakId: "ca._0ldsk00l.Nestopia",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

export const punes: Application = {
  id: "punes",
  name: "puNES",
  fileExtensions: [".nes"],
  flatpakId: "io.github.punesemu.puNES",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
      optionParams.push("yes");
    }
    return optionParams;
  },
};

export const mednafen: Application = {
  id: "mednafen",
  name: "Mednafen",
  fileExtensions: [".cue", ".pce", ".nes", ".sms", ".gg"],
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

const getSharedAresOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
}) => {
  // keyboard f2
  const hotkeyFullscreen = ["--setting", "Hotkey/ToggleFullscreen=0x1/0/2"];
  const virtualPad = [
    "--setting",
    "Input/Driver=SDL",
    "--setting",
    "VirtualPad1/Pad.Up=0x3/1/1/Lo;;",
    "--setting",
    "VirtualPad1/Pad.Down=0x3/1/1/Hi;;",
    "--setting",
    "VirtualPad1/Pad.Left=0x3/1/0/Lo;;",
    "--setting",
    "VirtualPad1/Pad.Right=0x3/1/0/Hi;;",
    "--setting",
    "VirtualPad1/Select=0x3/3/6;;",
    "--setting",
    "VirtualPad1/Start=0x3/3/7;;",
    "--setting",
    "VirtualPad1/A..South=0x3/3/0;;",
    "--setting",
    "VirtualPad1/B..East=0x3/3/1;;",
    "--setting",
    "VirtualPad1/X..West=0x3/3/2;;",
    "--setting",
    "VirtualPad1/Y..North=0x3/3/3;;",
    "--setting",
    "VirtualPad1/L-Bumper=0x3/3/4;;",
    "--setting",
    "VirtualPad1/R-Bumper=0x3/3/5;;",
    "--setting",
    "VirtualPad1/L-Trigger=0x3/0/2/Hi;;",
    "--setting",
    "VirtualPad1/R-Trigger=0x3/0/5/Hi;;",
    "--setting",
    "VirtualPad1/L-Stick..Click=0x3/3/9;;",
    "--setting",
    "VirtualPad1/R-Stick..Click=0x3/3/10;;",
    "--setting",
    "VirtualPad1/L-Up=0x3/0/1/Lo;;",
    "--setting",
    "VirtualPad1/L-Down=0x3/0/1/Hi;;",
    "--setting",
    "VirtualPad1/L-Left=0x3/0/0/Lo;;",
    "--setting",
    "VirtualPad1/L-Right=0x3/0/0/Hi;;",
    "--setting",
    "VirtualPad1/R-Up=0x3/0/4/Lo;;",
    "--setting",
    "VirtualPad1/R-Down=0x3/0/4/Hi;;",
    "--setting",
    "VirtualPad1/R-Left=0x3/0/3/Lo;;",
    "--setting",
    "VirtualPad1/R-Right=0x3/0/3/Hi;;",
  ];
  const optionParams = [...hotkeyFullscreen, ...virtualPad];
  if (fullscreen) {
    optionParams.push("--fullscreen");
  }
  return optionParams;
};

export const ares: Application = {
  id: "ares",
  name: "Ares",
  fileExtensions: [
    ".z64",
    ".sms",
    ".gg",
    ".chd",
    ".nes",
    ".sgd",
    ".smd",
    ".gb",
    ".gba",
    ".cue",
    ".pce",
  ],
  flatpakId: "dev.ares.ares",
  createOptionParams: getSharedAresOptionParams,
};

export const aresMegaDrive: Application = {
  ...ares,
  id: "aresMegaDrive",
  fileExtensions: [".sfc", ".smc", ".68K", ".bin"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Mega Drive"],
  ],
};

export const aresSegaCd: Application = {
  ...ares,
  id: "aresSegaCd",
  fileExtensions: [".chd", ".cue"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Mega CD"],
  ],
};

export const aresSega32x: Application = {
  ...ares,
  id: "aresSega32x",
  fileExtensions: [".32x"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Mega 32X"],
  ],
};

export const mupen64plus: Application = {
  id: "mupen64plus",
  name: "Mupen64Plus",
  fileExtensions: [".z64"],
  flatpakId: "io.github.simple64.simple64",
};

export const rosaliesMupenGui: Application = {
  id: "rosaliesMupenGui",
  name: "Rosalie's Mupen GUI",
  fileExtensions: [".z64"],
  flatpakId: "com.github.Rosalie241.RMG",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

export const mgba: Application = {
  id: "mgba",
  name: "mgba",
  fileExtensions: [".gb", ".gba"],
  flatpakId: "io.mgba.mGBA",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

export const flycast: Application = {
  id: "flycast",
  name: "Flycast",
  fileExtensions: [".cue", ".chd", ".gdi", ".cdi"],
  flatpakId: "org.flycast.Flycast",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--config");
      optionParams.push("window:fullscreen=yes");
    }
    return optionParams;
  },
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
  punes,
  mednafen,
  mame,
  mameNeoGeo,
  mameNeoGeoCD,
  ares,
  aresMegaDrive,
  aresSegaCd,
  aresSega32x,
  mupen64plus,
  rosaliesMupenGui,
  mgba,
  flycast,
} satisfies Record<string, Application>;
