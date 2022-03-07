import igdb from "igdb-api-node";

import { Entry } from "~/types/category";

interface Game {
  cover?: {
    image_id: string;
  };
  name: string;
  alternative_names?: [{ name: string }];
}

export interface GamesResponse {
  data: Game[];
  config?: {
    data?: unknown;
  };
}

const igdbSubTitleChar = ":";
const windowsSubTitleChar = " -";

const replaceSubTitleChar = (a: string) =>
  a.replace(windowsSubTitleChar, igdbSubTitleChar);

const removeRegion = (a: string) => a.replace(/\(.*\)/gi, "").trim();

export const getCoverUrl = (gameId: string) =>
  `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameId}.png`;

const filterCaseInsensitive = (field: string, value: string) =>
  `${field}~"${value}"`;

const gameFilters = ["name", "alternative_names.name"];
const filterGame = ({ name }: Entry): string[] => {
  const normalizedName = replaceSubTitleChar(removeRegion(name));
  return gameFilters.map((filter) =>
    filterCaseInsensitive(filter, normalizedName)
  );
};

const normalizeString = (a: string) =>
  replaceSubTitleChar(removeRegion(a))
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.]/gi, "")
    .toLowerCase()
    .trim();

const matchName = (a: string, b: string) =>
  normalizeString(a) === normalizeString(b);

// TODO: add tests
export const fetchCovers = async (platformIds: number[], entries: Entry[]) => {
  try {
    const client = igdb(
      process.env.IGDB_CLIENT_ID,
      process.env.IGDB_ACCESS_TOKEN
    );

    const gamesResponse: GamesResponse = await client
      .fields(["name", "cover.image_id,alternative_names.name"])
      .where(
        `platforms=(${platformIds}) &
        (${entries.flatMap(filterGame).join(" | ")})`
      )
      .limit(500)
      .request("/games");

    // console.log("request", gamesResponse.config?.data);

    // console.log("game", gamesResponse.data);

    const entriesWithImages = entries.map((entry) => {
      const gameData = gamesResponse.data.find(
        ({ name, alternative_names }) =>
          matchName(name, entry.name) ||
          !!alternative_names?.find(({ name }) => matchName(name, entry.name))
      );
      if (gameData?.cover) {
        return {
          ...entry,
          imageUrl: getCoverUrl(gameData.cover.image_id),
        };
      }
      return entry;
    });

    return entriesWithImages;
  } catch (e) {
    console.log("igdb error", e);
    return entries;
  }
};
