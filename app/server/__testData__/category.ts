import type { Category, Entry } from "../../types/jsonFiles/category";
import nodepath from "path";
import { general } from "./general";

export const addIndex = <P extends Entry>(entries: P[]): P[] => {
  let index = 0;

  return entries.map((entry) => {
    const newEntry: P = {
      ...entry,
      id: `${entry.id}${index}`,
    };

    if (entry.subEntries) {
      const newSubEntries = entry.subEntries.map((subEntry) => {
        const newSubEntry: Entry = {
          ...subEntry,
          id: `${subEntry.id}${index}`,
        };
        index++;
        return newSubEntry;
      });
      return {
        ...newEntry,
        subEntries: newSubEntries,
      };
    } else {
      index++;
      return newEntry;
    }
  });
};

export const createCategoryPath = (categoryName: string) =>
  nodepath.join(general.categoriesPath, categoryName);

export const createAbsoluteEntryPath = (
  categoryName: string,
  entryPath: string,
) => nodepath.join(general.categoriesPath, categoryName, entryPath);

export const metroidsamusreturns: Entry = {
  id: "metroidsamusreturns",
  name: "Metroid Samus Returns",
  path: "Metroid Samus Returns.cci",
};

export const nintendo3ds = {
  id: "nintendo3ds",
  name: "Nintendo 3DS",
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
  entries: addIndex([cotton, gateofthunder]),
} satisfies Category;

export const pcenginecdLinux = {
  id: "pcenginecd",
  name: "PC Engine CD",
  entries: addIndex([cotton, gateofthunder]),
} satisfies Category;

export const monkeyIsland: Entry = {
  id: "thesecretofmonkeyisland",
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
  id: "finalfantasyvii(j)(disc1)0",
  name: "Final Fantasy VII (J) (Disc 1)",
  path: "Final Fantasy VII (J) (Disc 1).chd",
  metaData: {
    imageUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2kx2.webp",
    expiresOn: 1728906938376,
  },
  subEntries: [
    {
      id: "finalfantasyvii(j)(disc1)0",
      name: "Final Fantasy VII (J) (Disc 1)",
      path: "Final Fantasy VII (J) (Disc 1).chd",
      metaData: {
        imageUrl:
          "https://images.igdb.com/igdb/image/upload/t_cover_big/co2kx2.webp",
        expiresOn: 1728906938376,
      },
    },
    {
      id: "finalfantasyvii(j)(disc2)1",
      name: "Final Fantasy VII (J) (Disc 2)",
      path: "Final Fantasy VII (J) (Disc 2).chd",
    },
    {
      id: "finalfantasyvii(j)(disc3)2",
      name: "Final Fantasy VII (J) (Disc 3)",
      path: "Final Fantasy VII (J) (Disc 3).chd",
    },
  ],
};

export const finalfantasy7disc1: Entry = {
  id: "finalfantasyvii(j)(disc1)",
  name: "Final Fantasy VII (J) (Disc 1)",
  path: "Final Fantasy VII (J) (Disc 1).chd",
};

export const finalfantasy7disc2: Entry = {
  id: "finalfantasyvii(j)(disc2)",
  name: "Final Fantasy VII (J) (Disc 2)",
  path: "Final Fantasy VII (J) (Disc 2).chd",
};

export const finalfantasy7disc3: Entry = {
  id: "finalfantasyvii(j)(disc3)",
  name: "Final Fantasy VII (J) (Disc 3)",
  path: "Final Fantasy VII (J) (Disc 3).chd",
};

export const ehrgeiz: Entry = {
  id: "ehrgeiz",
  name: "Ehrgeiz",
  path: "Ehrgeiz.chd",
};

export const ehrgeizJapan: Entry = {
  id: "ehrgeiz(j)",
  name: "Ehrgeiz (J)",
  path: "Ehrgeiz (J).chd",
};

export const playstation = {
  id: "sonyplaystation",
  name: "Sony Playstation",
  entries: addIndex([hugo, hugo2]),
} satisfies Category;

export const playstation2 = {
  id: "sonyplaystation2",
  name: "Sony Playstation 2",
  entries: addIndex([fahrenheit]),
} satisfies Category;

export const psallstarsDisc: Entry = {
  id: "eboot",
  name: "PlayStation All-Stars Battle Royale",
  path: "dev_hdd0/GAMES/XCUS00003-[PlayStation AllStars Battle Royale]/PS3_GAME/USRDIR/EBOOT.BIN",
  metaData: {
    imageUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ssv.webp",
    expiresOn: 1728917362970,
  },
};

export const psallstarsManual: Entry = {
  id: "eboot",
  name: "PlayStation All-Stars Battle Royale (Manual)",
  path: "dev_hdd0/game/NPUO70233/USRDIR/EBOOT.BIN",
  metaData: {
    imageUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ssv.webp",
    expiresOn: 1728917362970,
  },
};

export const psallstarsDigital: Entry = {
  id: "eboot",
  name: "PlayStation All-Stars Battle Royale",
  path: "dev_hdd0/game/BCUS98472/USRDIR/EBOOT.BIN",
  metaData: {
    imageUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ssv.webp",
    expiresOn: 1728917362970,
  },
};

export const psallstars: Entry = {
  id: "eboot0",
  name: "PlayStation All-Stars Battle Royale",
  path: "dev_hdd0/GAMES/XCUS00003-[PlayStation AllStars Battle Royale]/PS3_GAME/USRDIR/EBOOT.BIN",
  subEntries: [
    {
      id: "eboot0",
      name: "PlayStation All-Stars Battle Royale",
      path: "dev_hdd0/GAMES/XCUS00003-[PlayStation AllStars Battle Royale]/PS3_GAME/USRDIR/EBOOT.BIN",
    },
    {
      id: "eboot1",
      name: "PlayStation All-Stars Battle Royale (Manual)",
      path: "dev_hdd0/game/NPUO70233/USRDIR/EBOOT.BIN",
    },
  ],
  metaData: {
    imageUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ssv.webp",
    expiresOn: 1728917362970,
  },
};

export const playstation3 = {
  id: "sonyplaystation3",
  name: "Sony Playstation 3",
  entries: addIndex([fahrenheit]),
} satisfies Category;

export const bayoubilly: Entry = {
  id: "adventuresofbayoubilly,the(e)",
  name: "Adventures of Bayou Billy, The (E)",
  path: "Adventures of Bayou Billy, The (E).nes",
};

export const lastBladeBeyondDestiny: Entry = {
  id: "lastbladebeyonddestiny",
  name: "Last Blade, The - Beyond the Destiny (Europe)",
  path: "Last Blade, The - Beyond the Destiny (Europe).nes",
};

export const kingOfFightersR2: Entry = {
  id: "kingoffightersr2",
  name: "King of Fighters R-2 - Pocket Fighting Series (World) (En,Ja)",
  path: "King of Fighters R-2 - Pocket Fighting Series (World) (En,Ja).nes",
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

export const doomPlutonium: Entry = {
  id: "doom2",
  name: "Final Doom (The Plutonia Experiment)",
  path: "Final DOOM/Plutonia/DOOM2.EXE",
};

export const doomEvilution: Entry = {
  id: "doom2",
  name: "Final Doom (TNT: Evilution)",
  path: "Final DOOM/TNT/DOOM2.EXE",
};

export const dos = {
  id: "dos",
  name: "DOS",
  entries: addIndex([commanderkeen4]),
} satisfies Category;

export const turtles2: Entry = {
  id: "teenagemutantheroturtlesii-thearcadegame",
  name: "Teenage Mutant Hero Turtles II - The Arcade Game",
  path: "Teenage Mutant Hero Turtles II - The Arcade Game.nes",
};

export const turtles2Japan: Entry = {
  id: "teenagemutantheroturtlesii-thearcadegame(J)",
  name: "Teenage Mutant Hero Turtles II - The Arcade Game (J)",
  path: "Teenage Mutant Hero Turtles II - The Arcade Game (J).nes",
};

export const marioTetrisWorldCup: Entry = {
  id: "mariotetrisworldcup",
  name: "Super Mario Bros. - Tetris - Nintendo World Cup",
  path: "Super Mario Bros. - Tetris - Nintendo World Cup.nes",
};

export const nes = {
  id: "nintendoentertainmentsystem",
  name: "NES",
  entries: addIndex([turtles2, turtles2Japan]),
} satisfies Category;

export const blazingstar: Entry = {
  id: "blazstar",
  name: "blazstar",
  path: "blazstar.zip",
};

export const neogeo = {
  id: "neogeo",
  name: "Neo Geo",
  entries: addIndex([blazingstar]),
} satisfies Category;
