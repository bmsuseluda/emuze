import type { Entry } from "../../types/jsonFiles/category.js";
import { getExpiresOn } from "../../server/getExpiresOn.server.js";
import type { EntryWithSystem } from "../../types/jsonFiles/lastPlayed.js";

export const games: Entry[] = [
  {
    id: "animaniacs",
    name: "Animaniacs",
    path: "F:/games/Emulation/roms/Super Nintendo/Animaniacs.sfc",
  },
  {
    id: "axelay",
    name: "Axelay",
    path: "F:/games/Emulation/roms/Super Nintendo/Axelay.sfc",
    metaData: {
      imageUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co25my.webp",
      expiresOn: getExpiresOn(),
    },
  },
  {
    id: "bahamutlagoon",
    name: "Bahamut Lagoon",
    path: "F:/games/Emulation/roms/Super Nintendo/Bahamut Lagoon.sfc",
  },
  {
    id: "batmanreturns",
    name: "Batman Returns",
    path: "F:/games/Emulation/roms/Super Nintendo/Batman Returns.sfc",
    metaData: {
      imageUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co3bsp.webp",
      expiresOn: getExpiresOn(),
    },
  },
  {
    id: "claymates",
    name: "Claymates",
    path: "F:/games/Emulation/roms/Super Nintendo/Claymates.sfc",
  },
  {
    id: "contraiii",
    name: "Contra III",
    path: "F:/games/Emulation/roms/Super Nintendo/Contra III.smc",
  },
  {
    id: "donkeykongcountry2",
    name: "Donkey Kong Country 2",
    path: "F:/games/Emulation/roms/Super Nintendo/Donkey Kong Country 2.sfc",
    metaData: {
      imageUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co217m.webp",
      expiresOn: getExpiresOn(),
    },
  },
  {
    id: "donkeykongcountry3",
    name: "Donkey Kong Country 3",
    path: "F:/games/Emulation/roms/Super Nintendo/Donkey Kong Country 3.sfc",
  },
  {
    id: "donkeykongcountry",
    name: "Donkey Kong Country",
    path: "F:/games/Emulation/roms/Super Nintendo/Donkey Kong Country.sfc",
    metaData: {
      imageUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co29n6.webp",
      expiresOn: getExpiresOn(),
    },
  },
  {
    id: "earthwormjim",
    name: "Earthworm Jim",
    path: "F:/games/Emulation/roms/Super Nintendo/Earthworm Jim.sfc",
  },
  {
    id: "powerrangers",
    name: "Power Rangers",
    path: "F:/games/Emulation/roms/Super Nintendo/Power Rangers.sfc",
    metaData: {
      imageUrl: "brokenpicture.webp",
      expiresOn: getExpiresOn(),
    },
  },
];

export const gamesLastPlayed: EntryWithSystem[] = [
  {
    id: "digdogs:streetbusters0",
    name: "Dig Dogs: Streetbusters",
    path: "Dig Dogs - Streetbusters/DIGDOGS.EXE",
    metaData: {
      imageUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co6t12.webp",
      expiresOn: 1725799928695,
    },
    systemId: "dos",
    lastPlayed: 1725614938868,
  },
  {
    id: "supermarioland1",
    name: "Super Mario Land",
    path: "Super Mario Land.gb",
    metaData: {
      imageUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co7o14.webp",
      expiresOn: 1725799928347,
    },
    systemId: "nintendogameboy",
    lastPlayed: 1725614928605,
  },
  {
    id: "californiagames2",
    name: "California Games",
    path: "California Games/CALGAMES.EXE",
    metaData: {
      imageUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co7033.webp",
      expiresOn: 1725799928695,
    },
    systemId: "dos",
    lastPlayed: 1725614919436,
  },
  {
    id: "commanderkeeningoodbye,galaxy!:thearmageddonmachine3",
    name: "Commander Keen in Goodbye, Galaxy!: The Armageddon Machine",
    path: "Commander Keen in Goodbye, Galaxy! - The Armageddon Machine/Keen5e.exe",
    metaData: {
      imageUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co25s4.webp",
      expiresOn: 1725799928695,
    },
    systemId: "dos",
    lastPlayed: 1725614906938,
  },
  {
    id: "driver1",
    name: "Driver",
    path: "Driver.chd",
    metaData: {
      imageUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co6he0.webp",
      expiresOn: 1728043561028,
    },
    systemId: "sonyplaystation",
    lastPlayed: 1725614906930,
    subEntries: [
      {
        id: "driver(disc1)1",
        name: "Driver (Disc 1)",
        path: "Driver (Disc 1).chd",
        metaData: {
          imageUrl:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co6he0.webp",
          expiresOn: 1728043561028,
        },
      },
      {
        id: "driver(disc2)2",
        name: "Driver (Disc 2)",
        path: "Driver (Disc 2).chd",
        metaData: {
          imageUrl:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co6he0.webp",
          expiresOn: 1728043561028,
        },
      },
    ],
  },
];
