import type { Category, Entry } from "~/types/jsonFiles/category";
import nodepath from "path";
import { general } from "~/server/__testData__/general";

export const addIndex = (entries: Entry[]) =>
  entries.map((entry, index) => ({ ...entry, id: `${entry.id}${index}` }));

export const createCategoryPath = (categoryName: string) =>
  nodepath.join(general.categoriesPath, categoryName);

export const createAbsoluteEntryPath = (
  categoryName: string,
  entryPath: string,
) => nodepath.join(general.categoriesPath, categoryName, entryPath);

export const metroidsamusreturns: Entry = {
  id: "metroidsamusreturns",
  name: "Metroid Samus Returns",
  path: "Metroid Samus Returns.3ds",
};

export const nintendo3ds = {
  id: "nintendo3ds",
  name: "Nintendo 3DS",
  application: {
    id: "citra",
    path: "F:/games/Emulation/emulators/Citra/nightly-mingw/citra-qt.exe",
  },
  entries: addIndex([metroidsamusreturns]),
} satisfies Category;

export const cotton: Entry = {
  id: "cotton",
  name: "Cotton",
  path: "Cotton.cue",
};

export const gateofthunder: Entry = {
  id: "gateofthunder",
  name: "Gate of Thunder",
  path: "Gate of Thunder.CUE",
};

export const pcenginecd = {
  id: "pcenginecd",
  name: "PC Engine CD",
  application: {
    id: "mednafen",
    path: "F:/games/Emulation/emulators/mednafen-1.29.0-win64/mednafen.exe",
  },
  entries: addIndex([cotton, gateofthunder]),
} satisfies Category;

export const pcenginecdLinux = {
  id: "pcenginecd",
  name: "PC Engine CD",
  application: {
    id: "mednafen",
  },
  entries: addIndex([cotton, gateofthunder]),
} satisfies Category;

export const monkeyIsland: Entry = {
  id: "monkey1",
  name: "The Secret of Monkey Island",
  path: "monkey1",
};

export const bladerunner: Entry = {
  id: "bladerunner",
  name: "Blade Runner",
  path: "bladerunner",
};

export const scumm = {
  id: "scumm",
  name: "Scumm",
  application: {
    id: "scummvm",
    path: "F:/games/Emulation/emulators/scummvm/scummvm.exe",
  },
  entries: addIndex([monkeyIsland, bladerunner]),
} satisfies Category;

export const fahrenheit: Entry = {
  id: "fahrenheit",
  name: "Fahrenheit",
  path: "Fahrenheit.chd",
};

export const hugo: Entry = {
  id: "hugo",
  name: "Hugo",
  path: "Hugo/Hugo.chd",
};

export const hugo2: Entry = {
  id: "hugo2",
  name: "Hugo 2",
  path: "Hugo 2.chd",
};

export const finalfantasy7: Entry = {
  id: "finalfantasyvii(j)(disc1)",
  name: "Final Fantasy VII (J) (Disc 1)",
  path: "Final Fantasy VII (J) (Disc 1).chd",
};

export const playstation = {
  id: "sonyplaystation",
  name: "Sony Playstation",
  application: {
    id: "duckstation",
    path: "F:/games/Emulation/emulators/duckstation-windows-x64-release/duckstation-nogui-x64-ReleaseLTCG.exe",
  },
  entries: addIndex([hugo, hugo2]),
} satisfies Category;

export const playstation2 = {
  id: "sonyplaystation2",
  name: "Sony Playstation 2",
  application: {
    id: "pcsx2",
  },
  entries: addIndex([fahrenheit]),
} satisfies Category;

export const bayoubilly: Entry = {
  id: "adventuresofbayoubilly,the(e)",
  name: "Adventures of Bayou Billy, The (E)",
  path: "Adventures of Bayou Billy, The (E).nes",
};

export const boyandhisblob: Entry = {
  id: "boyandhisblob,a(e)",
  name: "Boy and his Blob, A (E)",
  path: "Boy and his Blob, A (E).nes",
};

export const commanderkeen4: Entry = {
  id: "keen4e",
  name: "Commander Keen in Goodbye, Galaxy!: Secret of the Oracle",
  path: "keen4e.exe",
};

export const turtles2: Entry = {
  id: "teenagemutantheroturtlesii-thearcadegame",
  name: "Teenage Mutant Hero Turtles II - The Arcade Game",
  path: "Teenage Mutant Hero Turtles II - The Arcade Game.nes",
};

export const blazingstar: Entry = {
  id: "blazstar",
  name: "blazstar",
  path: "blazstar.zip",
};

export const neogeo = {
  id: "neogeo",
  name: "Neo Geo",
  application: {
    id: "mameNeoGeo",
    path: "F:/games/Emulation/emulators/mame/mame.exe",
  },
  entries: addIndex([blazingstar]),
} satisfies Category;

export const neogeoLinux = {
  id: "neogeo",
  name: "Neo Geo",
  application: {
    id: "mameNeoGeo",
  },
  entries: addIndex([blazingstar]),
} satisfies Category;
