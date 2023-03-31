import type { Category, Entry } from "~/types/category";
import * as categoriesDB from "../categoriesDB.server";

interface CategoryOnWindows extends Category {
  applicationPath: string;
}

interface CategoryOnLinux extends Category {
  applicationFlatpakId: string;
}

const addIndex = (entries: Entry[]) =>
  entries.map((entry, index) => ({ ...entry, id: `${entry.id}${index}` }));

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
  igdbPlatformIds: categoriesDB.nintendo3ds.igdbPlatformIds,
  entries: addIndex([metroidsamusreturns]),
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

export const pcenginecd: CategoryOnWindows = {
  id: "pcenginecd",
  name: "PC Engine CD",
  applicationId: "mednafen",
  applicationPath:
    "F:/games/Emulation/emulators/mednafen-1.29.0-win64/mednafen.exe",
  entryPath: "F:/games/Emulation/roms/PC Engine CD",
  fileExtensions: [".cue", ".pce"],
  igdbPlatformIds: categoriesDB.pcenginecd.igdbPlatformIds,
  entries: addIndex([cotton, gateofthunder]),
};

export const pcenginecdLinux: CategoryOnLinux = {
  id: "pcenginecd",
  name: "PC Engine CD",
  applicationId: "mednafen",
  applicationFlatpakId: "org.mednafen",
  entryPath: "F:/games/Emulation/roms/PC Engine CD",
  fileExtensions: [".cue", ".pce"],
  igdbPlatformIds: categoriesDB.pcenginecd.igdbPlatformIds,
  entries: addIndex([cotton, gateofthunder]),
};

export const fahrenheit: Entry = {
  id: "fahrenheit",
  name: "Fahrenheit",
  path: "F:/games/Emulation/roms/Sony Playstation 2/Fahrenheit.chd",
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
  applicationId: "duckstation",
  applicationPath:
    "F:/games/Emulation/emulators/duckstation-windows-x64-release/duckstation-nogui-x64-ReleaseLTCG.exe",
  entryPath: "F:/games/Emulation/roms/Sony Playstation",
  fileExtensions: [".chd", ".cue"],
  igdbPlatformIds: categoriesDB.sonyplaystation.igdbPlatformIds,
  entries: [
    { ...hugo, id: `${hugo.id}0` },
    { ...hugo2, id: `${hugo2.id}1` },
  ],
};

export const playstation2: CategoryOnLinux = {
  id: "sonyplaystation2",
  name: "Sony Playstation 2",
  applicationId: "pcsx2",
  applicationFlatpakId: "net.pcsx2.PCSX2",
  applicationFlatpakOptionParams: ["--command=pcsx2-qt"],
  entryPath: "/home/dennisludwig/Documents/Emulation/Sony Playstation 2",
  fileExtensions: [".chd", ".iso"],
  igdbPlatformIds: categoriesDB.sonyplaystation2.igdbPlatformIds,
  entries: addIndex([fahrenheit]),
};

export const bayoubilly: Entry = {
  id: "adventuresofbayoubilly,the(e)",
  name: "Adventures of Bayou Billy, The (E)",
  path: "F:/games/Emulation/roms/Nintendo Entertainment System/Adventures of Bayou Billy, The (E).nes",
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
  applicationId: "mameneogeo",
  applicationPath: "F:/games/Emulation/emulators/mame/mame.exe",
  entryPath: "F:/games/Emulation/roms/Neo Geo",
  fileExtensions: [".zip"],
  igdbPlatformIds: categoriesDB.neogeo.igdbPlatformIds,
  entries: addIndex([blazingstar]),
};

export const neogeoLinux: CategoryOnLinux = {
  id: "neogeo",
  name: "Neo Geo",
  applicationId: "mameneogeo",
  applicationFlatpakId: "org.mame",
  entryPath: "F:/games/Emulation/roms/Neo Geo",
  fileExtensions: [".zip"],
  igdbPlatformIds: categoriesDB.neogeo.igdbPlatformIds,
  entries: addIndex([blazingstar]),
};
