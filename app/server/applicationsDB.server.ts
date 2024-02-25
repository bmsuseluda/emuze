import nodepath from "path";

import type { Category, Entry } from "~/types/jsonFiles/category";
import type { GeneralConfigured } from "~/types/jsonFiles/settings/general";
import type { Appearance } from "~/types/jsonFiles/settings/appearance";
import mameGames from "~/server/nameMappings/mame.json";
import scummVmGames from "~/server/nameMappings/scummvm.json";
import ps3Games from "~/server/nameMappings/ps3.json";
import dosGames from "~/server/nameMappings/dos.json";

type Settings = {
  general: GeneralConfigured;
  appearance: Appearance;
};

type OptionParamFunction = ({
  entryData,
  categoryData,
  settings,
  absoluteEntryPath,
}: {
  entryData: Entry;
  categoryData: Category;
  settings: Settings;
  absoluteEntryPath: string;
}) => string[];
type EnvironmentVariableFunction = (
  category: Category,
  settings: Settings,
) => Record<string, string | null>;

type FindEntryNameFunction = ({
  entry,
  categoriesPath,
  categoryName,
}: {
  entry: Entry;
  categoriesPath: string;
  categoryName: string;
}) => string;

export type ExcludeFilesFunction = (filenames: string[]) => string[];

export interface Application {
  id: ApplicationId;
  name: string;
  fileExtensions?: `${string}.${string}`[];
  entryAsDirectory?: boolean;
  omitAbsoluteEntryPathAsLastParam?: boolean;
  environmentVariables?: EnvironmentVariableFunction;
  createOptionParams?: OptionParamFunction;
  flatpakId: string;
  flatpakOptionParams?: string[];
  findEntryName?: FindEntryNameFunction;
  excludeFiles?: ExcludeFilesFunction;
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

const findGameNameById = (
  id: string,
  mapping: Record<string, string>,
  applicationName: string,
) => {
  let gameName: string;
  try {
    gameName = mapping[id];
  } catch (error) {
    console.log("findGameNameById", applicationName, error);
    return id;
  }

  return gameName || id;
};

const findMameArcadeGameName: FindEntryNameFunction = ({ entry: { name } }) =>
  findGameNameById(name, mameGames, "mame");

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
  excludeFiles: () => ["neogeo.zip"],
};

export const mameNeoGeoCD: Application = {
  ...mame,
  id: "mameNeoGeoCD",
  createOptionParams: (...props) => [
    ...getSharedMameOptionParams(...props),
    "neocdz",
    "-cdrm",
  ],
  excludeFiles: () => ["neocdz.zip"],
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
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--disc");
    return optionParams;
  },
};

/**
 * Find the 9digit serial number from path
 *
 * @param path  e.g. 'dev_hdd0/game/NPUB30493/USRDIR/EBOOT.BIN' or '/games/BLES01658-[Dragon Ball Z Budokai HD Collection]/PS3_GAME/USRDIR/EBOOT.BIN'
 */
export const findPlaystation3Serial = (path: string): string | undefined =>
  path
    .split(nodepath.sep)
    .reverse()
    .find(
      (pathSegment) =>
        pathSegment.match(/^\w{9}$/) || pathSegment.match(/^\w{9}-\[(.*)]$/),
    )
    ?.split("-")[0];

/**
 * Find the 9digit serial number and map to the Gamename.
 *
 * @param name EBOOT.BIN
 * @param path e.g. 'dev_hdd0/game/NPUB30493/USRDIR/EBOOT.BIN' or '/games/BLES01658-[Dragon Ball Z Budokai HD Collection]/PS3_GAME/USRDIR/EBOOT.BIN'
 */
const findPlaystation3GameName: FindEntryNameFunction = ({
  entry: { name, path },
}) => {
  let entryName: string | null = null;

  const serial = findPlaystation3Serial(path);

  if (serial) {
    try {
      entryName = (ps3Games as Record<string, string>)[serial];
    } catch (error) {
      console.log("findPs3GameName", error);
      return name;
    }
  }

  return entryName || name;
};

/**
 * Exclude files without serial and files that are just update files for physical games
 */
export const excludePlaystationFiles: ExcludeFilesFunction = (filepaths) => {
  const filepathsTemp = [...filepaths];
  return filepaths.filter((filepath) => {
    const serial = findPlaystation3Serial(filepath);

    const foundExclude =
      !serial ||
      filepathsTemp.find(
        (otherFilepath) =>
          otherFilepath !== filepath &&
          serial === findPlaystation3Serial(otherFilepath),
      );

    if (foundExclude) {
      filepathsTemp.splice(
        filepathsTemp.findIndex((filepathTemp) => filepathTemp === filepath),
        1,
      );
    }

    return foundExclude;
  });
};

export const rpcs3: Application = {
  id: "rpcs3",
  name: "RPCS3",
  flatpakId: "net.rpcs3.RPCS3",
  fileExtensions: ["EBOOT.BIN"],
  findEntryName: findPlaystation3GameName,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
      optionParams.push("--no-gui");
    }
    return optionParams;
  },
  excludeFiles: excludePlaystationFiles,
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

export const yuzu: Application = {
  id: "yuzu",
  name: "yuzu",
  fileExtensions: [".xci", ".nsp"],
  flatpakId: "org.yuzu_emu.yuzu",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-f");
    }
    optionParams.push("-g");
    return optionParams;
  },
};

export const ryujinx: Application = {
  id: "ryujinx",
  name: "Ryujinx",
  fileExtensions: [".xci", ".nsp"],
  flatpakId: "org.ryujinx.Ryujinx",
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

export const cemu: Application = {
  id: "cemu",
  name: "Cemu",
  fileExtensions: [".wud", ".wux", ".wua", ".rpx"],
  flatpakId: "info.cemu.Cemu",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-f");
    }
    optionParams.push("-g");
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

/**
 * Returns filenames that are not the configured file to start the game.
 *
 * @param filenames
 */
export const excludeDosSecondaryFiles: ExcludeFilesFunction = (filenames) =>
  filenames.filter((filename) => {
    const filenameWithoutFoldername = nodepath.basename(filename);

    return !(dosGames as Record<string, string>)[
      filenameWithoutFoldername.toLowerCase()
    ];
  });

const findDosGameName: FindEntryNameFunction = ({ entry: { path } }) =>
  findGameNameById(nodepath.basename(path).toLowerCase(), dosGames, "dos");

export const dosboxstaging: Application = {
  id: "dosboxstaging",
  name: "DOSBox-Staging",
  fileExtensions: [".exe"],
  flatpakId: "io.github.dosbox-staging",
  excludeFiles: excludeDosSecondaryFiles,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
    entryData: { path },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--working-dir", nodepath.dirname(absoluteEntryPath));
    optionParams.push(
      "-c",
      "loadfix",
      nodepath.basename(path, nodepath.extname(path)),
    );
    return optionParams;
  },
  findEntryName: findDosGameName,
};

const findScummVmGameNameViaMapping: FindEntryNameFunction = ({
  entry: { name },
}) => findGameNameById(name, scummVmGames, "scummvm");

// TODO: check if this is a good pattern. It depends on executing the emulator for every game
// const findScummVmGameNameViaDetectLinux = (absoluteEntryPath: string) => {
//   // TODO: what to do if the emulator is not installed?
//   return spawnSync(
//     "flatpak",
//     ["run", scummvm.flatpakId, `--path=${absoluteEntryPath}`, "--detect"],
//     {
//       encoding: "utf-8",
//       maxBuffer: 1000000000,
//     },
//   ).stdout.toString();
// };
//
// const findScummVmGameNameViaDetect: FindEntryNameFunction = ({
//   entry: { name, path },
//   categoriesPath,
//   categoryName,
// }) => {
//   const absoluteEntryPath = createAbsoluteEntryPath(
//     categoriesPath,
//     categoryName,
//     path,
//   );
//   // TODO: add windows way
//   // TODO: what to do if the emulator is not installed?
//   const data = findScummVmGameNameViaDetectLinux(absoluteEntryPath);
//
//   const rows = data.split("\n");
//   const entryNameRow = rows.find((row) => row.match(/\w+:\w+.*/));
//   if (entryNameRow) {
//     // split by minimum of 3 whitespaces
//     const [, name] = entryNameRow.split(/\s{3,}/);
//     return name.split("(")[0].trim();
//   }
//
//   return name;
// };
//
// const findScummVmGameName: FindEntryNameFunction = (props) => {
//   const detectedName = findScummVmGameNameViaDetect(props);
//   if (detectedName) {
//     return detectedName;
//   }
//
//   const mappedName = findScummVmGameNameViaMapping(props);
//   if (mappedName) {
//     return mappedName;
//   }
//
//   return props.entry.name;
// };

export const scummvm: Application = {
  id: "scummvm",
  name: "ScummVM",
  flatpakId: "org.scummvm.ScummVM",
  entryAsDirectory: true,
  omitAbsoluteEntryPathAsLastParam: true,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push(`--path=${absoluteEntryPath}`);
    optionParams.push("--auto-detect");
    return optionParams;
  },
  findEntryName: findScummVmGameNameViaMapping,
};

export type ApplicationId = keyof typeof applications;

export const applications = {
  duckstation,
  pcsx2,
  play,
  rpcs3,
  ppsspp,
  blastem,
  bsnes,
  snes9x,
  citra,
  melonds,
  desmume,
  dolphin,
  yuzu,
  ryujinx,
  cemu,
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
  dosboxstaging,
  scummvm,
} satisfies Record<string, Application>;
