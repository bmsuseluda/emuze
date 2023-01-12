import igdb from "igdb-api-node";

import type { Entry } from "~/types/category";
import { openErrorDialog } from "~/server/openDialog.server";

interface GameLocalization {
  name?: string;
  cover?: {
    image_id: string;
  };
}

interface Game {
  cover?: {
    image_id: string;
  };
  name: string;
  alternative_names?: [{ name: string }];
  game_localizations?: GameLocalization[];
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

const findGameLocalization = (
  entryName: string,
  gameLocalizations?: GameLocalization[]
) => gameLocalizations?.find(({ name }) => name && matchName(name, entryName));

export const getCoverUrl = (entryName: string, gameData: Game) => {
  const localization = findGameLocalization(
    entryName,
    gameData.game_localizations
  );

  const gameId = localization?.cover?.image_id || gameData.cover?.image_id;

  if (gameId) {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameId}.png`;
  }

  return null;
};

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
          "cover.image_id,alternative_names.name,game_localizations.name,game_localizations.cover.image_id",
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
            !!findGameLocalization(entry.name, game_localizations)
        );
        if (gameData) {
          const imageUrl = getCoverUrl(entry.name, gameData);
          if (imageUrl) {
            return {
              ...entry,
              imageUrl,
            };
          }
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
