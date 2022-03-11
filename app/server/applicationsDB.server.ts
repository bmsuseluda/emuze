import nodepath from "path";

import { Entry, Category as CategoryData } from "~/types/category";
import {
  arcade,
  Category,
  neogeo,
  nintendo3ds,
  nintendo64,
  nintendoentertainmentsystem,
  nintendogameboy,
  nintendogamecube,
  nintendowii,
  pcengine,
  pcenginecd,
  segamegadrive,
  segasaturn,
  sonyplaystation,
  sonyplaystation2,
  sonypsp,
  supernintendo,
} from "./categoriesDB.server";

type OptionParamFunction = (entry: Entry) => string[];
type EnvironmentVariableFunction = (
  category: CategoryData
) => Record<string, string>;

interface Application {
  id: string;
  name: string;
  fileExtensions: string[];
  categories: Category[];
  environmentVariables?: EnvironmentVariableFunction;
  optionParams?: OptionParamFunction;
}

export const pcsx2 = {
  id: "pcsx2",
  name: "PCSX2",
  fileExtensions: [".chd", ".iso"],
  categories: [sonyplaystation2],
};

const applications: Application[] = [
  {
    id: "duckstation",
    name: "Duckstation",
    fileExtensions: [".chd", ".cue"],
    categories: [sonyplaystation],
  },
  pcsx2,
  {
    id: "ppsspp",
    name: "PPSSPP",
    fileExtensions: [".cso"],
    categories: [sonypsp],
  },
  {
    id: "blastem",
    name: "BlastEm",
    fileExtensions: [".68K", ".bin", ".sgd", ".smd"],
    categories: [segamegadrive],
  },
  {
    id: "bsnes",
    name: "BSNES",
    fileExtensions: [".sfc", ".smc"],
    categories: [supernintendo],
  },
  {
    id: "citra",
    name: "Citra",
    fileExtensions: [".3ds"],
    categories: [nintendo3ds],
  },
  {
    id: "dolphin",
    name: "Dolphin",
    fileExtensions: [".iso"],
    categories: [nintendogamecube, nintendowii],
  },
  {
    id: "mesen",
    name: "Mesen",
    fileExtensions: [".nes"],
    categories: [nintendoentertainmentsystem],
  },
  {
    id: "mednafen",
    name: "Mednafen",
    fileExtensions: [".cue", ".pce"],
    categories: [segasaturn, pcengine, pcenginecd],
    environmentVariables: ({ applicationPath }) => ({
      MEDNAFEN_HOME: nodepath.dirname(applicationPath),
    }),
  },
  {
    id: "mame",
    name: "Mame",
    fileExtensions: [".zip"],
    categories: [arcade, neogeo],
    optionParams: ({ path }) => {
      const entryDirname = nodepath.dirname(path);
      return [
        "-w",
        "-rompath",
        entryDirname,
        "-cfg_directory",
        nodepath.join(entryDirname, "cfg"),
        "-nvram_directory",
        nodepath.join(entryDirname, "nvram"),
      ];
    },
  },
  {
    id: "ares",
    name: "Ares",
    fileExtensions: [".z64"],
    categories: [nintendo64],
  },
  {
    id: "visualboyadvance",
    name: "Visual Boy Advance",
    fileExtensions: [".gb", ".gba"],
    categories: [nintendogameboy],
  },
];

export const getApplicationData = (name: string) =>
  applications.find(({ id }) => name.toLowerCase().includes(id.toLowerCase()));
