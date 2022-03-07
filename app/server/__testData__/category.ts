import { Category, Entry } from "~/types/category";
import * as categoriesDB from "../categoriesDB.server";

export const metroidsamusreturns = {
  id: "metroidsamusreturns",
  name: "Metroid Samus Returns",
  path: "F:\\games\\Emulation\\roms\\Nintendo 3DS\\Metroid Samus Returns.3ds",
};

export const nintendo3ds: Category = {
  id: "nintendo3ds",
  name: "Nintendo 3DS",
  applicationId: "citra",
  applicationPath:
    "F:\\games\\Emulation\\emulators\\Citra\\nightly-mingw\\citra-qt.exe",
  entryPath: "F:\\games\\Emulation\\roms\\Nintendo 3DS",
  fileExtensions: [".3ds"],
  platformIds: categoriesDB.nintendo3ds.platformIds,
  entries: [metroidsamusreturns],
};

export const cotton: Entry = {
  id: "cotton",
  name: "Cotton",
  path: "F:\\games\\Emulation\\roms\\PC Engine CD\\Cotton.cue",
};

export const gateofthunder: Entry = {
  id: "gateofthunder",
  name: "Gate of Thunder",
  path: "F:\\games\\Emulation\\roms\\PC Engine CD\\Gate of Thunder.CUE",
};

export const windsofthunder: Entry = {
  id: "windsofthunder",
  name: "Winds of Thunder",
  path: "F:\\games\\Emulation\\roms\\PC Engine CD\\Winds of Thunder.cue",
};

export const pcenginecd: Category = {
  id: "pcenginecd",
  name: "PC Engine CD",
  applicationId: "mednafen-1.29.0-win64",
  applicationPath:
    "F:\\games\\Emulation\\emulators\\mednafen-1.29.0-win64\\mednafen.exe",
  entryPath: "F:\\games\\Emulation\\roms\\PC Engine CD",
  fileExtensions: [".cue", ".pce"],
  platformIds: categoriesDB.pcenginecd.platformIds,
  entries: [cotton, gateofthunder],
};

export const hugo: Entry = {
  id: "hugo",
  name: "Hugo",
  path: "F:\\games\\Emulation\\roms\\Sony Playstation\\Hugo\\Hugo.chd",
};

export const hugo2: Entry = {
  id: "hugo2",
  name: "Hugo 2",
  path: "F:\\games\\Emulation\\roms\\Sony Playstation\\Hugo 2.chd",
};

export const playstation: Category = {
  id: "sonyplaystation",
  name: "Sony Playstation",
  applicationId: "duckstation-windows-x64-release",
  applicationPath:
    "F:\\games\\Emulation\\emulators\\duckstation-windows-x64-release\\duckstation-nogui-x64-ReleaseLTCG.exe",
  entryPath: "F:\\games\\Emulation\\roms\\Sony Playstation",
  fileExtensions: [".chd", ".cue"],
  platformIds: categoriesDB.sonyplaystation.platformIds,
  entries: [hugo, hugo2],
};
