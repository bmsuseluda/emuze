import nodepath from "path";

import type { Entry, Category as CategoryData } from "~/types/category";
import type { Category } from "~/server/categoriesDB.server";
import { segadreamcast } from "~/server/categoriesDB.server";
import {
  neogeocd,
  segacd,
  segamastersystem,
} from "~/server/categoriesDB.server";
import {
  nintendods,
  nintendogameboyadvance,
  nintendogameboycolor,
} from "~/server/categoriesDB.server";
import {
  arcade,
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
} from "~/server/categoriesDB.server";

type OptionParamFunction = (entry: Entry) => string[];
type EnvironmentVariableFunction = (
  category: CategoryData
) => Record<string, string | null>;

export interface Application {
  id: string;
  name: string;
  fileExtensions: string[];
  categories: Category[];
  environmentVariables?: EnvironmentVariableFunction;
  optionParams?: OptionParamFunction;
  flatpakId?: string;
}

export const pcsx2: Application = {
  id: "pcsx2",
  name: "PCSX2",
  fileExtensions: [".chd", ".iso"],
  categories: [sonyplaystation2],
  flatpakId: "net.pcsx2.PCSX2",
};

export const blastem: Application = {
  id: "blastem",
  name: "BlastEm",
  fileExtensions: [".68K", ".bin", ".sgd", ".smd"],
  categories: [segamegadrive],
  flatpakId: "com.retrodev.blastem",
};

export const bsnes: Application = {
  id: "bsnes",
  name: "BSNES",
  fileExtensions: [".sfc", ".smc"],
  categories: [supernintendo],
  flatpakId: "dev.bsnes.bsnes",
};

export const applications: Application[] = [
  {
    id: "duckstation",
    name: "Duckstation",
    fileExtensions: [".chd", ".cue"],
    categories: [sonyplaystation],
    flatpakId: "org.duckstation.DuckStation",
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
    environmentVariables: ({ applicationPath }) => ({
      MEDNAFEN_HOME: applicationPath ? nodepath.dirname(applicationPath) : null,
    }),
  },
  {
    id: "mame",
    name: "Mame",
    fileExtensions: [".zip", ".chd"],
    categories: [arcade, neogeo, neogeocd],
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
        // TODO: the following optionParams are necessary for neogeocd only
        // "neocdz",
        // "-cdrm",
      ];
    },
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

export const getApplicationData = (name: string) =>
  applications.find(({ id }) => name.toLowerCase().includes(id.toLowerCase()));
