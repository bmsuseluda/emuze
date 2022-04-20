import nodepath from "path";

import type { Application, Applications } from "~/types/applications";
import {
  nintendo3ds,
  nintendoentertainmentsystem,
  nintendogamecube,
  nintendowii,
  pcengine,
  pcenginecd,
  segamegadrive,
  segasaturn,
  sonyplaystation,
  sonyplaystation2,
  supernintendo,
} from "../categoriesDB.server";

export const getDirectoryname = (path: string) => {
  const basename = nodepath.basename(path);
  return path.split(basename)[0];
};

export const pcsx2: Application = {
  categories: [sonyplaystation2],
  path: "F:\\games\\Emulation\\emulators\\Pcsx2-v1.7.2242-windows-64bit-AVX2\\pcsx2x64-avx2.exe",
  fileExtensions: [".chd", ".iso"],
  id: "pcsx2-v1.7.2242-windows-64bit-avx2",
  name: "PCSX2",
};

export const pcsx2Old: Application = {
  categories: [sonyplaystation2],
  path: "F:\\games\\Emulation\\emulators\\pcSX2-v1.6.2242-windows-64bit-AVX2\\pcsx2x64-avx2.exe",
  fileExtensions: [".chd", ".iso"],
  id: "pcsx2-v1.6.2242-windows-64bit-avx2",
  name: "PCSX2",
};

export const blastem: Application = {
  categories: [segamegadrive],
  path: "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\blastem.exe",
  fileExtensions: [".68K", ".bin", ".sgd", ".smd"],
  id: "blastemwin32-0.6.2",
  name: "BlastEm",
};

export const applications: Applications = [
  blastem,
  {
    categories: [supernintendo],
    path: "F:\\games\\Emulation\\emulators\\bsnes\\bsnes-mt.exe",
    fileExtensions: [".sfc", ".smc"],
    id: "bsnes",
    name: "BSNES",
  },
  {
    categories: [sonyplaystation],
    path: "F:\\games\\Emulation\\emulators\\duckstation-windows-x64-release\\duckstation-nogui-x64-ReleaseLTCG.exe",
    fileExtensions: [".chd", ".cue"],
    id: "duckstation-windows-x64-release",
    name: "Duckstation",
  },
  {
    categories: [nintendoentertainmentsystem],
    path: "F:\\games\\Emulation\\emulators\\Mesen.0.9.9\\Mesen.exe",
    fileExtensions: [".nes"],
    id: "mesen.0.9.9",
    name: "Mesen",
  },
  {
    categories: [nintendo3ds],
    path: "F:\\games\\Emulation\\emulators\\Citra\\nightly-mingw\\citra-qt.exe",
    fileExtensions: [".3ds"],
    id: "citra",
    name: "Citra",
  },
  pcsx2,
  {
    categories: [nintendogamecube, nintendowii],
    path: "F:\\games\\Emulation\\emulators\\dolphin-master-5.0-15445-x64\\Dolphin.exe",
    fileExtensions: [".iso"],
    id: "dolphin-master-5.0-15445-x64",
    name: "Dolphin",
  },
  {
    categories: [segasaturn, pcengine, pcenginecd],
    path: "F:\\games\\Emulation\\emulators\\mednafen-1.29.0-win64\\mednafen.exe",
    fileExtensions: [".cue", ".pce"],
    id: "mednafen-1.29.0-win64",
    name: "Mednafen",
  },
];
