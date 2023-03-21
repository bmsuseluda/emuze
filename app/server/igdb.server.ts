import igdb from "igdb-api-node";

import type { Entry } from "~/types/category";
import { openErrorDialog } from "~/server/openDialog.server";
import { clientId, getAccessToken } from "~/server/igdbAuthentication.server";
import type { Apicalypse } from "apicalypse";

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

const setCommaSeparatedArticleAsPrefix = (a: string) => {
  if (a.includes(",")) {
    const [gameName, article] = a.split(",");
    return `${article.trim()} ${gameName}`;
  }
  return a;
};

const removeRegion = (a: string) => a.replace(/\(.*\)|\[.*]/gi, "").trim();

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
  const normalizedName = replaceSubTitleChar(
    setCommaSeparatedArticleAsPrefix(removeRegion(name))
  );
  return gameFilters.map((filter) =>
    filterCaseInsensitive(filter, normalizedName)
  );
};

const normalizeString = (a: string) =>
  replaceSubTitleChar(setCommaSeparatedArticleAsPrefix(removeRegion(a)))
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.]/gi, "")
    .toLowerCase()
    .trim();

const matchName = (a: string, b: string) =>
  normalizeString(a) === normalizeString(b);

export const chunk = <T>(array: T[], maxEntries: number): Array<T[]> => {
  const chunks = [];
  const chunkNumber = Math.ceil(array.length / maxEntries);

  for (let i = 0; i < chunkNumber; i++) {
    chunks.push(array.slice(i * maxEntries, (i + 1) * maxEntries));
  }

  return chunks;
};

const fetchCoversForChunk = async (
  client: Apicalypse,
  platformId: number[],
  entries: Entry[]
) => {
  const gamesResponse: GamesResponse = await client
    .fields([
      "name",
      "cover.image_id,alternative_names.name,game_localizations.name,game_localizations.cover.image_id",
    ])
    .where(
      `platforms=(${platformId}) &
            (${entries.flatMap(filterGame).join(" | ")})`
    )
    .limit(500)
    .request("/games");

  const entriesWithImages = entries.map((entry) => {
    const gameData = gamesResponse.data.find(
      ({ name, alternative_names, game_localizations }) =>
        matchName(name, entry.name) ||
        !!alternative_names?.find(({ name }) => matchName(name, entry.name)) ||
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
};

export const fetchCovers = async (platformId: number[], entries: Entry[]) => {
  if (entries.length > 0) {
    const entryChunks = chunk(entries, 200);
    try {
      const accessToken = await getAccessToken();
      const client = igdb(clientId, accessToken);

      const entriesWithImages = await Promise.all(
        entryChunks.map((entryChunk) =>
          fetchCoversForChunk(client, platformId, entryChunk)
        )
      );

      return entriesWithImages.flat();
    } catch (error) {
      openErrorDialog(error, `Fetch covers from igdb failed`);
      console.log("igdb error", error);
      return entries;
    }
  }
  return entries;
};
