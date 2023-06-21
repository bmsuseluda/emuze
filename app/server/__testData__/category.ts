import type { Category, Entry } from "~/types/jsonFiles/category";

export const addIndex = (entries: Entry[]) =>
  entries.map((entry, index) => ({ ...entry, id: `${entry.id}${index}` }));

export const metroidsamusreturns: Entry = {
  id: "metroidsamusreturns",
  name: "Metroid Samus Returns",
  path: "F:/games/Emulation/roms/Nintendo 3DS/Metroid Samus Returns.3ds",
};

export const nintendo3ds = {
  id: "nintendo3ds",
  name: "Nintendo 3DS",
  application: {
    id: "citra",
    path: "F:/games/Emulation/emulators/Citra/nightly-mingw/citra-qt.exe",
  },
  entryPath: "F:/games/Emulation/roms/Nintendo 3DS",
  entries: addIndex([metroidsamusreturns]),
} satisfies Category;

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

export const pcenginecd = {
  id: "pcenginecd",
  name: "PC Engine CD",
  application: {
    id: "mednafen",
    path: "F:/games/Emulation/emulators/mednafen-1.29.0-win64/mednafen.exe",
  },
  entryPath: "F:/games/Emulation/roms/PC Engine CD",
  entries: addIndex([cotton, gateofthunder]),
} satisfies Category;

export const pcenginecdLinux = {
  id: "pcenginecd",
  name: "PC Engine CD",
  application: {
    id: "mednafen",
  },
  entryPath: "F:/games/Emulation/roms/PC Engine CD",
  entries: addIndex([cotton, gateofthunder]),
} satisfies Category;

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
  id: "finalfantasyvii(j)(disc1)",
  name: "Final Fantasy VII (J) (Disc 1)",
  path: "F:/games/Emulation/roms/Sony Playstation/Final Fantasy VII (J) (Disc 1).chd",
};

export const playstation = {
  id: "sonyplaystation",
  name: "Sony Playstation",
  application: {
    id: "duckstation",
    path: "F:/games/Emulation/emulators/duckstation-windows-x64-release/duckstation-nogui-x64-ReleaseLTCG.exe",
  },
  entryPath: "F:/games/Emulation/roms/Sony Playstation",
  entries: addIndex([hugo, hugo2]),
} satisfies Category;

export const playstation2 = {
  id: "sonyplaystation2",
  name: "Sony Playstation 2",
  application: {
    id: "pcsx2",
  },
  entryPath: "/home/dennisludwig/Documents/Emulation/Sony Playstation 2",
  entries: addIndex([fahrenheit]),
} satisfies Category;

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

export const neogeo = {
  id: "neogeo",
  name: "Neo Geo",
  application: {
    id: "mameNeoGeo",
    path: "F:/games/Emulation/emulators/mame/mame.exe",
  },
  entryPath: "F:/games/Emulation/roms/Neo Geo",
  entries: addIndex([blazingstar]),
} satisfies Category;

export const neogeoLinux = {
  id: "neogeo",
  name: "Neo Geo",
  application: {
    id: "mameNeoGeo",
  },
  entryPath: "F:/games/Emulation/roms/Neo Geo",
  entries: addIndex([blazingstar]),
} satisfies Category;
