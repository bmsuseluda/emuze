import {
  bayoubilly,
  boyandhisblob,
  commanderkeen4,
  fahrenheit,
  finalfantasy7,
  hugo,
  hugo2,
  kingOfFightersR2,
  lastBladeBeyondDestiny,
  marioTetrisWorldCup,
  turtles2,
} from "../__testData__/category";
import type { GamesResponse } from "../igdb.server";
import {
  chunk,
  fetchMetaData,
  filterGame,
  removeSubTitle,
} from "../igdb.server";
import { categories as categoriesDB } from "../categoriesDB.server";
import { getExpiresOn } from "../getExpiresOn.server";

vi.mock("@kmamal/sdl");

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

vi.mock("../openDialog.server.ts", () => ({
  openErrorDialog: vi.fn(),
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

  describe("filterGame", () => {
    it("Should return filter array for game with simple game name", () => {
      const result = filterGame(hugo);
      expect(result).toStrictEqual([
        'name~"Hugo"*',
        'alternative_names.name~"Hugo"*',
        'game_localizations.name~"Hugo"*',
      ]);
    });

    it("Should return filter array for game with multiple discs and region", () => {
      const result = filterGame(finalfantasy7);
      expect(result).toStrictEqual([
        'name~"Final Fantasy VII"*',
        'alternative_names.name~"Final Fantasy VII"*',
        'game_localizations.name~"Final Fantasy VII"*',
      ]);
    });

    it("Should return filter array for game with subtitle", () => {
      const result = filterGame(turtles2);
      expect(result).toStrictEqual([
        'name~"Teenage Mutant Hero Turtles II"*',
        'alternative_names.name~"Teenage Mutant Hero Turtles II"*',
        'game_localizations.name~"Teenage Mutant Hero Turtles II"*',
      ]);
    });

    it("Should return filter array for game with multiple subtitles", () => {
      const result = filterGame(marioTetrisWorldCup);
      expect(result).toStrictEqual([
        'name~"Super Mario Bros."*',
        'alternative_names.name~"Super Mario Bros."*',
        'game_localizations.name~"Super Mario Bros."*',
      ]);
    });

    it("Should return filter array for game with comma separated article 'a'", () => {
      const result = filterGame(boyandhisblob);
      expect(result).toStrictEqual([
        'name~"A Boy and his Blob"*',
        'alternative_names.name~"A Boy and his Blob"*',
        'game_localizations.name~"A Boy and his Blob"*',
      ]);
    });

    it("Should return filter array for game with comma separated article 'the'", () => {
      const result = filterGame(bayoubilly);
      expect(result).toStrictEqual([
        'name~"The Adventures of Bayou Billy"*',
        'alternative_names.name~"The Adventures of Bayou Billy"*',
        'game_localizations.name~"The Adventures of Bayou Billy"*',
      ]);
    });
  });

  describe("fetchMetaData", () => {
    it("Should return games if they match directly on name or alternative name", async () => {
      const igdbResponse: GamesResponse = {
        data: [
          {
            name: "Hugo",
          },
          {
            name: "Hugo 360",
            alternative_names: [
              {
                name: "Hugo 2",
              },
            ],
            cover: {
              image_id: "hugo360img",
            },
          },
        ],
      };
      igdbRequestMock.mockResolvedValue(igdbResponse);

      const entriesWithImages = await fetchMetaData(
        categoriesDB.sonyplaystation.igdbPlatformIds,
        [hugo, hugo2],
      );

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
      const igdbResponse: GamesResponse = {
        data: [
          {
            name: "Indigo Prophecy",
            cover: {
              image_id: "indigoimg",
            },
            game_localizations: [
              {
                name: "Fahrenheit",
                cover: {
                  image_id: "fahrenheitimg",
                },
              },
            ],
          },
        ],
      };
      igdbRequestMock.mockResolvedValue(igdbResponse);

      const entriesWithImages = await fetchMetaData(
        categoriesDB.sonyplaystation2.igdbPlatformIds,
        [fahrenheit],
      );

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
      const igdbResponse: GamesResponse = {
        data: [
          {
            name: "Final Fantasy vii",
            alternative_names: [
              {
                name: "FF7",
              },
            ],
            cover: {
              image_id: "ff7img",
            },
          },
        ],
      };
      igdbRequestMock.mockResolvedValue(igdbResponse);

      const entriesWithImages = await fetchMetaData(
        categoriesDB.sonyplaystation.igdbPlatformIds,
        [finalfantasy7],
      );

      expect(entriesWithImages).toStrictEqual([
        {
          ...finalfantasy7,
          metaData: {
            expiresOn: getExpiresOn(),
            imageUrl:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/ff7img.webp",
          },
        },
      ]);
    });

    it("Should return games with subtitle", async () => {
      const igdbResponse: GamesResponse = {
        data: [
          {
            name: "Teenage Mutant Ninja Turtles II: The Arcade Game",
            alternative_names: [
              {
                name: "Teenage Mutant Hero Turtles II: The Arcade Game",
              },
            ],
            cover: {
              image_id: "turtles2img",
            },
          },
          {
            name: "King of Fighters R-2",
            cover: {
              image_id: "kingoffightersr2img",
            },
          },
        ],
      };
      igdbRequestMock.mockResolvedValue(igdbResponse);

      const entriesWithImages = await fetchMetaData(
        [18],
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
      const igdbResponse: GamesResponse = {
        data: [
          {
            name: "Teenage Mutant Ninja Turtles II - The Arcade Game",
            alternative_names: [
              {
                name: "Teenage Mutant Hero Turtles II: The Arcade Game",
              },
            ],
            cover: {
              image_id: "turtles2img",
            },
          },
        ],
      };
      igdbRequestMock.mockResolvedValue(igdbResponse);

      const entriesWithImages = await fetchMetaData([18], [turtles2]);

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

    it("Should return games with subtitle, but through alternative name", async () => {
      const igdbResponse: GamesResponse = {
        data: [
          {
            name: "Teenage Mutant Ninja Turtles 2 - The Arcade Game",
            alternative_names: [
              {
                name: "Teenage Mutant Hero Turtles II",
              },
            ],
            cover: {
              image_id: "turtles2img",
            },
          },
        ],
      };
      igdbRequestMock.mockResolvedValue(igdbResponse);

      const entriesWithImages = await fetchMetaData([18], [turtles2]);

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
      const igdbResponse: GamesResponse = {
        data: [
          {
            name: "Super Mario Bros. / Tetris / Nintendo World Cup",
            cover: {
              image_id: "mariotetrisworldcupimg",
            },
          },
        ],
      };
      igdbRequestMock.mockResolvedValue(igdbResponse);

      const entriesWithImages = await fetchMetaData(
        [18],
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
      const igdbResponse: GamesResponse = {
        data: [
          {
            name: "The Adventures of Bayou Billy",
            cover: {
              image_id: "bayoubillyimg",
            },
          },
          {
            name: "A Boy and his Blob",
            cover: {
              image_id: "boyandhisblobimg",
            },
          },
          {
            name: "Commander Keen in Goodbye, Galaxy!: Secret of the Oracle",
            cover: {
              image_id: "keen4img",
            },
          },
          {
            name: "The Last Blade: Beyond the Destiny",
            cover: {
              image_id: "lastbladebeyonddestinyimg",
            },
          },
        ],
      };
      igdbRequestMock.mockResolvedValue(igdbResponse);

      const entriesWithImages = await fetchMetaData(
        [18],
        [bayoubilly, boyandhisblob, commanderkeen4, lastBladeBeyondDestiny],
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

describe("chunk", () => {
  it("Should chunk the array into 2 chunks for 5 entries", () => {
    const entries = [1, 2, 3, 4, 5];
    const result = chunk(entries, 3);

    expect(result).toStrictEqual([
      [1, 2, 3],
      [4, 5],
    ]);
  });
});
