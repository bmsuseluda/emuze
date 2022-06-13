import type { Category, Entry } from "~/types/category";
import * as categoriesDB from "../categoriesDB.server";

interface CategoryOnWindows extends Category {
  applicationPath: string;
}

interface CategoryOnLinux extends Category {
  applicationFlatpakId: string;
}

export const metroidsamusreturns = {
  id: "metroidsamusreturns",
  name: "Metroid Samus Returns",
  path: "F:/games/Emulation/roms/Nintendo 3DS/Metroid Samus Returns.3ds",
};

export const nintendo3ds: CategoryOnWindows = {
  id: "nintendo3ds",
  name: "Nintendo 3DS",
  applicationId: "citra",
  applicationPath:
    "F:/games/Emulation/emulators/Citra/nightly-mingw/citra-qt.exe",
  entryPath: "F:/games/Emulation/roms/Nintendo 3DS",
  fileExtensions: [".3ds"],
  platformIds: categoriesDB.nintendo3ds.platformIds,
  entries: [metroidsamusreturns],
};

export const cotton: Entry = {
  id: "cotton",
  name: "Cotton",
  path: "F:/games/Emulation/roms/PC Engine CD/Cotton.cue",
};

export const gateofthunder: Entry = {
  id: "gateofthunder",
  name: "Gate of Thunder",
  path: "F:/games/Emulation/roms/PC Engine CD/Gate of Thunder.CUE",
};

export const windsofthunder: Entry = {
  id: "windsofthunder",
  name: "Winds of Thunder",
  path: "F:/games/Emulation/roms/PC Engine CD/Winds of Thunder.cue",
};

export const pcenginecd: CategoryOnWindows = {
  id: "pcenginecd",
  name: "PC Engine CD",
  applicationId: "mednafen-1.29.0-win64",
  applicationPath:
    "F:/games/Emulation/emulators/mednafen-1.29.0-win64/mednafen.exe",
  entryPath: "F:/games/Emulation/roms/PC Engine CD",
  fileExtensions: [".cue", ".pce"],
  platformIds: categoriesDB.pcenginecd.platformIds,
  entries: [cotton, gateofthunder],
};

export const pcenginecdLinux: CategoryOnLinux = {
  id: "pcenginecd",
  name: "PC Engine CD",
  applicationId: "mednafen-1.29.0-win64",
  applicationFlatpakId: "org.mednafen",
  entryPath: "F:/games/Emulation/roms/PC Engine CD",
  fileExtensions: [".cue", ".pce"],
  platformIds: categoriesDB.pcenginecd.platformIds,
  entries: [cotton, gateofthunder],
};

export const hugo: Entry = {
  id: "hugo",
  name: "Hugo",
  path: "F:/games/Emulation/roms/Sony Playstation/Hugo/Hugo.chd",
};

export const hugo2: Entry = {
  id: "hugo2",
  name: "Hugo 2",
  path: "F:/games/Emulation/roms/Sony Playstation/Hugo 2.chd",
};

export const finalfantasy7: Entry = {
  id: "finalfantasyvii(J)(disc1)",
  name: "Final Fantasy VII (J) (Disc 1)",
  path: "F:/games/Emulation/roms/Sony Playstation/Final Fantasy VII (J) (Disc 1).chd",
};

export const playstation: CategoryOnWindows = {
  id: "sonyplaystation",
  name: "Sony Playstation",
  applicationId: "duckstation-windows-x64-release",
  applicationPath:
    "F:/games/Emulation/emulators/duckstation-windows-x64-release/duckstation-nogui-x64-ReleaseLTCG.exe",
  entryPath: "F:/games/Emulation/roms/Sony Playstation",
  fileExtensions: [".chd", ".cue"],
  platformIds: categoriesDB.sonyplaystation.platformIds,
  entries: [hugo, hugo2],
};

export const turtles2: Entry = {
  id: "teenagemutantheroturtlesii-thearcadegame",
  name: "Teenage Mutant Hero Turtles II - The Arcade Game",
  path: "F:/games/Emulation/roms/Nintendo Entertainment System/Teenage Mutant Hero Turtles II - The Arcade Game.nes",
};

export const blazingstar: Entry = {
  id: "blazstar",
  name: "blazstar",
  path: "F:/games/Emulation/roms/Neo Geo/blazstar.zip",
};

export const neogeo: CategoryOnWindows = {
  id: "neogeo",
  name: "Neo Geo",
  applicationId: "mame",
  applicationPath: "F:/games/Emulation/emulators/mame/mame.exe",
  entryPath: "F:/games/Emulation/roms/Neo Geo",
  fileExtensions: [".zip"],
  platformIds: categoriesDB.neogeo.platformIds,
  entries: [blazingstar],
};

export const neogeoLinux: CategoryOnLinux = {
  id: "neogeo",
  name: "Neo Geo",
  applicationId: "mame",
  applicationFlatpakId: "org.mame",
  entryPath: "F:/games/Emulation/roms/Neo Geo",
  fileExtensions: [".zip"],
  platformIds: categoriesDB.neogeo.platformIds,
  entries: [blazingstar],
};
