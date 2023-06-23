import {
  bayoubilly,
  fahrenheit,
  finalfantasy7,
  hugo,
  hugo2,
  turtles2,
} from "../__testData__/category";
import type { GamesResponse } from "../igdb.server";
import { chunk, fetchMetaData } from "../igdb.server";
import { categories as categoriesDB } from "../categoriesDB.server";
import { getExpiresOn } from "~/server/getExpiresOn.server";

const igdbRequestMock = jest.fn();
jest.mock("apicalypse", () => () => ({
  fields: () => ({
    where: () => ({
      limit: () => ({
        request: igdbRequestMock,
      }),
    }),
  }),
}));

jest.mock("~/server/openDialog.server.ts", () => ({
  openErrorDialog: jest.fn(),
}));

jest.mock("~/server/getExpiresOn.server.ts", () => {
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
      [hugo, hugo2]
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
      [fahrenheit]
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
      [finalfantasy7]
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

  it("Should return games with comma separated article", async () => {
    const igdbResponse: GamesResponse = {
      data: [
        {
          name: "The Adventures of Bayou Billy",
          cover: {
            image_id: "bayoubillyimg",
          },
        },
      ],
    };
    igdbRequestMock.mockResolvedValue(igdbResponse);

    const entriesWithImages = await fetchMetaData([18], [bayoubilly]);

    expect(entriesWithImages).toStrictEqual([
      {
        ...bayoubilly,
        metaData: {
          expiresOn: getExpiresOn(),
          imageUrl:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/bayoubillyimg.webp",
        },
      },
    ]);
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
