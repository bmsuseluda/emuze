import {
  bayoubilly,
  boyandhisblob,
  commanderkeen4,
  fahrenheit,
  finalfantasy7disc1,
  hugo,
  hugo2,
  kingOfFightersR2,
  lastBladeBeyondDestiny,
  marioTetrisWorldCup,
  turtles2,
} from "../__testData__/category";
import { fetchMetaDataFromDB, removeSubTitle } from "../igdb.server";
import { getExpiresOn } from "../getExpiresOn.server";
import type { Entry } from "../../types/jsonFiles/category";

vi.mock("@bmsuseluda/node-sdl");
vi.mock("../openDialog.server.ts");

const igdbRequestMock = vi.fn();
vi.mock("apicalypse", () => ({
  default: () => ({
    fields: () => ({
      where: () => ({
        limit: () => ({
          offset: () => ({
            request: igdbRequestMock,
          }),
        }),
      }),
    }),
  }),
}));

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

  describe("fetchMetaData", () => {
    it("Should return games if they match directly on name or alternative name", async () => {
      const entriesWithImages = fetchMetaDataFromDB("sonyplaystation", [
        hugo,
        hugo2,
      ]);

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

    it("Should return games if they match on localized name", async () => {
      const entriesWithImages = fetchMetaDataFromDB("sonyplaystation2", [
        fahrenheit,
      ]);

      expect(entriesWithImages).toStrictEqual([
        {
          ...fahrenheit,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/fahrenheitimg.webp",
          },
        },
      ]);
    });

    it("Should return games with multiple discs and region", async () => {
      const entriesWithImages = fetchMetaDataFromDB("sonyplaystation", [
        finalfantasy7disc1,
      ]);

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
      const entriesWithImages = fetchMetaDataFromDB(
        "nintendoentertainmentsystem",
        [turtles2, kingOfFightersR2],
      );

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
      const entriesWithImages = fetchMetaDataFromDB(
        "nintendoentertainmentsystem",
        [turtles2],
      );

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

    it("Should return games that starts with name, if no exact match", async () => {
      const maxPayne2: Entry = {
        id: "maxpayne2",
        name: "Max Payne 2",
        path: "Max Payne 2.chd",
      };

      const entriesWithImages = fetchMetaDataFromDB("sonyplaystation2", [
        maxPayne2,
      ]);

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

    it("Should return games with subtitle, but through alternative name", async () => {
      const entriesWithImages = fetchMetaDataFromDB(
        "nintendoentertainmentsystem",
        [turtles2],
      );

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

    it("Should return games with multiple subtitles", async () => {
      const entriesWithImages = fetchMetaDataFromDB(
        "nintendoentertainmentsystem",
        [marioTetrisWorldCup],
      );

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
      const entriesWithImages = await fetchMetaDataFromDB("dos", [
        bayoubilly,
        boyandhisblob,
        commanderkeen4,
        lastBladeBeyondDestiny,
      ]);

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
