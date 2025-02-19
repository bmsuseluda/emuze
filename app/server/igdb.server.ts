import type { Entry } from "../types/jsonFiles/category";
import { getExpiresOn } from "./getExpiresOn.server";
import type { SystemId } from "./categoriesDB.server/systemId";
import nodepath from "path";

interface GameLocalization {
  name?: string;
  cover?: {
    image_id: string;
  };
}

export interface Game {
  cover?: {
    image_id: string;
  };
  name: string;
  alternative_names?: [{ name: string }];
  game_localizations?: GameLocalization[];
}

export const removeSubTitle = (a: string) => a.split(/ -|[:/]|_/g)[0];

/**
 * Should place the comma separated article as a prefix.
 * A Prefix is identified by a comma followed by a white space and word with a minimum of 1 and maximum of 3 characters.
 */
const setCommaSeparatedArticleAsPrefix = (a: string) => {
  const regex = /, \b\w{1,3}\b/;
  const articleWithComma = a.match(regex);
  const article = articleWithComma?.at(0)?.split(", ").at(1);

  if (article) {
    const gameName = a.replace(regex, "");
    return `${article.trim()} ${gameName}`;
  }
  return a;
};

/**
 * Removes all brackets and their content
 */
const removeBrackets = (a: string) => a.replace(/\(.*\)|\[.*]/gi, "").trim();

const findGameLocalization = (
  entryName: string,
  gameLocalizations?: GameLocalization[],
) => gameLocalizations?.find(({ name }) => name && matchName(name, entryName));

export const getCoverUrl = (entryName: string, gameData: Game) => {
  const localization = findGameLocalization(
    entryName,
    gameData.game_localizations,
  );

  const gameId = localization?.cover?.image_id || gameData.cover?.image_id;

  if (gameId) {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameId}.webp`;
  }

  return null;
};

const normalizeString = (a: string) =>
  setCommaSeparatedArticleAsPrefix(removeBrackets(a))
    .replace(/[`~!@#$%^&*()_|+\-=?;:/'",. ]/gi, "")
    .toLowerCase()
    .trim();

const matchName = (a: string, b: string) =>
  normalizeString(a) === normalizeString(b);

const findGameDataByName = (nameToFind: string, games: Game[]) =>
  games.find(
    ({ name, alternative_names, game_localizations }) =>
      matchName(name, nameToFind) ||
      !!alternative_names?.find(({ name }) => matchName(name, nameToFind)) ||
      !!findGameLocalization(nameToFind, game_localizations),
  );

const findGameDataByNameLoose = (nameToFind: string, games: Game[]) => {
  const foundGames = games.filter(
    ({ name, alternative_names, game_localizations }) =>
      name.startsWith(nameToFind) ||
      !!alternative_names?.find(({ name }) => name.startsWith(nameToFind)) ||
      !!game_localizations?.find(
        ({ name }) => name && name.startsWith(nameToFind),
      ),
  );

  if (foundGames.length === 1) {
    return foundGames[0];
  }
  return undefined;
};

export const parseData = (entries: Entry[], data: Game[]) => {
  const expiresOn = getExpiresOn();
  return entries.map((entry) => {
    const nameWithoutSubTitle = removeSubTitle(entry.name);
    const gameData =
      findGameDataByName(entry.name, data) ||
      (nameWithoutSubTitle !== entry.name &&
        findGameDataByName(nameWithoutSubTitle, data)) ||
      findGameDataByNameLoose(entry.name, data);

    if (gameData) {
      const imageUrl = getCoverUrl(entry.name, gameData);
      if (imageUrl) {
        return {
          ...entry,
          metaData: {
            imageUrl,
            expiresOn,
          },
        } as Entry;
      }
    }
    return entry;
  });
};

export const fetchMetaDataFromDB = (systemId: SystemId, entries: Entry[]) => {
  const dbPath = nodepath.join(
    __dirname,
    "..",
    "fetchMetaData",
    "systems",
    `${systemId}.json`,
  );
  const data: Game[] = require(dbPath);
  return parseData(entries, data);
};
