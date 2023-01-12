import igdb from "igdb-api-node";

import type { Entry } from "~/types/category";
import { openErrorDialog } from "~/server/openDialog.server";

interface Game {
  cover?: {
    image_id: string;
  };
  name: string;
  alternative_names?: [{ name: string }];
  game_localizations?: [{ name?: string }];
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

const gameFilters = [
  "name",
  "alternative_names.name",
  "game_localizations.name",
];
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

export const fetchCovers = async (PlatformId: number[], entries: Entry[]) => {
  if (entries.length > 0) {
    // if (process.env.IGDB_CLIENT_ID && process.env.IGDB_ACCESS_TOKEN) {
    try {
      const client = igdb(
        "wrys9qyv68d1ydnc7gs0g1wzsu55j9",
        "vdnhpys6mxgqltph8phecslqxyw3q0"
      );
      // const client = igdb(
      //   process.env.IGDB_CLIENT_ID,
      //   process.env.IGDB_ACCESS_TOKEN
      // );

      const gamesResponse: GamesResponse = await client
        .fields([
          "name",
          "cover.image_id,alternative_names.name,game_localizations.name",
        ])
        .where(
          `platforms=(${PlatformId}) &
            (${entries.flatMap(filterGame).join(" | ")})`
        )
        .limit(500)
        .request("/games");

      // console.log("request", gamesResponse.config?.data);

      // console.log("game", gamesResponse.data);

      const entriesWithImages = entries.map((entry) => {
        const gameData = gamesResponse.data.find(
          ({ name, alternative_names, game_localizations }) =>
            matchName(name, entry.name) ||
            !!alternative_names?.find(({ name }) =>
              matchName(name, entry.name)
            ) ||
            !!game_localizations?.find(
              ({ name }) => name && matchName(name, entry.name)
            )
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
    } catch (error) {
      openErrorDialog(error, `Fetch covers from igdb failed`);
      console.log("igdb error", error);
      return entries;
    }
    // }
  }
  return entries;
};
