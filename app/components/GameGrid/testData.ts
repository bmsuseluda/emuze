import type { Entry } from "../../types/jsonFiles/category";
import { getExpiresOn } from "../../server/getExpiresOn.server";

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
