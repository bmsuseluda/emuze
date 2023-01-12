import {
  playstation,
  hugo,
  hugo2,
  finalfantasy7,
  turtles2,
  fahrenheit,
  playstation2,
} from "../__testData__/category";
import type { GamesResponse } from "../igdb.server";
import { fetchCovers } from "../igdb.server";

const igdbRequestMock = jest.fn();
jest.mock("igdb-api-node", () => () => ({
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

    const entriesWithImages = await fetchCovers(playstation.igdbPlatformIds, [
      hugo,
      hugo2,
    ]);

    expect(entriesWithImages).toStrictEqual([
      {
        ...hugo,
      },
      {
        ...hugo2,
        imageUrl:
          "https://images.igdb.com/igdb/image/upload/t_cover_big/hugo360img.png",
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

    const entriesWithImages = await fetchCovers(playstation2.igdbPlatformIds, [
      fahrenheit,
    ]);

    expect(entriesWithImages).toStrictEqual([
      {
        ...fahrenheit,
        imageUrl:
          "https://images.igdb.com/igdb/image/upload/t_cover_big/fahrenheitimg.png",
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

    const entriesWithImages = await fetchCovers(playstation.igdbPlatformIds, [
      finalfantasy7,
    ]);

    expect(entriesWithImages).toStrictEqual([
      {
        ...finalfantasy7,
        imageUrl:
          "https://images.igdb.com/igdb/image/upload/t_cover_big/ff7img.png",
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

    const entriesWithImages = await fetchCovers([18], [turtles2]);

    expect(entriesWithImages).toStrictEqual([
      {
        ...turtles2,
        imageUrl:
          "https://images.igdb.com/igdb/image/upload/t_cover_big/turtles2img.png",
      },
    ]);
  });
});
