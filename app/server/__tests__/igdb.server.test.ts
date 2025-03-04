import {
  bayoubilly,
  boyandhisblob,
  commanderkeen4,
  finalfantasy7disc1,
  hugo,
  hugo2,
  kingOfFightersR2,
  lastBladeBeyondDestiny,
  marioTetrisWorldCup,
  turtles2,
} from "../__testData__/category";
import type { Game } from "../igdb.server";
import { parseData, removeSubTitle } from "../igdb.server";
import { getExpiresOn } from "../getExpiresOn.server";
import type { Entry } from "../../types/jsonFiles/category";

vi.mock("../getExpiresOn.server.ts", () => {
  const getFutureDate = () => {
    const now = new Date();
    now.setDate(now.getDate() + 10);
    now.setSeconds(0);
    return now.getTime();
  };
  const futureDate = getFutureDate();
  return {
    getExpiresOn: () => futureDate,
  };
});

describe("igdb.server", () => {
  describe("removeSubTitle", () => {
    it("Should split the string by ' -'", () => {
      expect(removeSubTitle(turtles2.name)).toBe(
        "Teenage Mutant Hero Turtles II",
      );
    });

    it("Should split the string by '_'", () => {
      expect(removeSubTitle("The Legend of Zelda_ Tears of the Kingdom")).toBe(
        "The Legend of Zelda",
      );
    });

    it("Should not split the string by '-'", () => {
      expect(removeSubTitle(kingOfFightersR2.name)).toBe(
        "King of Fighters R-2",
      );
    });

    it("Should split the string by ':'", () => {
      expect(removeSubTitle(commanderkeen4.name)).toBe(
        "Commander Keen in Goodbye, Galaxy!",
      );
    });

    it("Should split the string by '/'", () => {
      expect(
        removeSubTitle("Super Mario Bros. - Tetris - Nintendo World Cup"),
      ).toBe("Super Mario Bros.");
    });
  });

  describe("parseData", () => {
    it("Should return games if they match directly", async () => {
      const igdbDB: Game[] = [
        ["Hugo 360", "hugo360img"],
        ["Hugo 2", "hugo360img"],
      ];
      const entriesWithImages = parseData([hugo, hugo2], igdbDB);

      expect(entriesWithImages).toStrictEqual([
        {
          ...hugo,
        },
        {
          ...hugo2,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/hugo360img.webp",
          },
        },
      ]);
    });

    it("Should return games with multiple discs and region", async () => {
      const igdbDB: Game[] = [
        ["Final Fantasy vii", "ff7img"],
        ["FF7", "ff7img"],
      ];
      const entriesWithImages = parseData([finalfantasy7disc1], igdbDB);

      expect(entriesWithImages).toStrictEqual([
        {
          ...finalfantasy7disc1,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/ff7img.webp",
          },
        },
      ]);
    });

    it("Should return games with subtitle", async () => {
      const igdbDB: Game[] = [
        ["Teenage Mutant Ninja Turtles II: The Arcade Game", "turtles2img"],
        ["Teenage Mutant Hero Turtles II: The Arcade Game", "turtles2img"],
        ["King of Fighters R-2", "kingoffightersr2img"],
      ];
      const entriesWithImages = parseData([turtles2, kingOfFightersR2], igdbDB);

      expect(entriesWithImages).toStrictEqual([
        {
          ...turtles2,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/turtles2img.webp",
          },
        },
        {
          ...kingOfFightersR2,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/kingoffightersr2img.webp",
          },
        },
      ]);
    });

    it("Should return games with subtitle, but other subTitleChar", async () => {
      const igdbDB: Game[] = [
        ["Teenage Mutant Ninja Turtles II - The Arcade Game", "turtles2img"],
        ["Teenage Mutant Hero Turtles II - The Arcade Game", "turtles2img"],
      ];
      const entriesWithImages = parseData([turtles2], igdbDB);

      expect(entriesWithImages).toStrictEqual([
        {
          ...turtles2,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/turtles2img.webp",
          },
        },
      ]);
    });

    it("Should return games that start with name, if no exact match", async () => {
      const igdbDB: Game[] = [
        ["Max Payne 2: The Fall of Max Payne", "maxpayne2img"],
      ];
      const maxPayne2: Entry = {
        id: "maxpayne2",
        name: "Max Payne 2",
        path: "Max Payne 2.chd",
      };

      const entriesWithImages = parseData([maxPayne2], igdbDB);

      expect(entriesWithImages).toStrictEqual([
        {
          ...maxPayne2,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/maxpayne2img.webp",
          },
        },
      ]);
    });

    it("Should return games with multiple subtitles", async () => {
      const igdbDB: Game[] = [
        [
          "Super Mario Bros. / Tetris / Nintendo World Cup",
          "mariotetrisworldcupimg",
        ],
      ];
      const entriesWithImages = parseData([marioTetrisWorldCup], igdbDB);

      expect(entriesWithImages).toStrictEqual([
        {
          ...marioTetrisWorldCup,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/mariotetrisworldcupimg.webp",
          },
        },
      ]);
    });

    it("Should return games with comma separated article", async () => {
      const igdbDB: Game[] = [
        ["The Adventures of Bayou Billy", "bayoubillyimg"],
        ["A Boy and his Blob", "boyandhisblobimg"],
        [
          "Commander Keen in Goodbye, Galaxy!: Secret of the Oracle",
          "keen4img",
        ],
        ["The Last Blade: Beyond the Destiny", "lastbladebeyonddestinyimg"],
      ];
      const entriesWithImages = parseData(
        [bayoubilly, boyandhisblob, commanderkeen4, lastBladeBeyondDestiny],
        igdbDB,
      );

      expect(entriesWithImages).toStrictEqual([
        {
          ...bayoubilly,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/bayoubillyimg.webp",
          },
        },
        {
          ...boyandhisblob,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/boyandhisblobimg.webp",
          },
        },
        {
          ...commanderkeen4,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/keen4img.webp",
          },
        },
        {
          ...lastBladeBeyondDestiny,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/lastbladebeyonddestinyimg.webp",
          },
        },
      ]);
    });
  });
});
