import { readFile } from "fs/promises";

import type { Entry } from "../types/jsonFiles/category";
import { getExpiresOn } from "./getExpiresOn.server";
import type { SystemId } from "./categoriesDB.server/systemId";
import nodepath from "path";

export type Game = [name: string, cover: string];

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

export const getCoverUrl = (gameData: Game) => {
  const gameId = gameData[1];

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

export const matchName = (a: string, b: string) =>
  normalizeString(a) === normalizeString(b);

const findGameDataByName = (nameToFind: string, games: Game[]) =>
  games.find(([name]) => matchName(name, nameToFind));

const findGameDataByNameLoose = (nameToFind: string, games: Game[]) => {
  const foundGames = games.filter(([name]) => name.startsWith(nameToFind));

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
      const imageUrl = getCoverUrl(gameData);
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

export const fetchMetaDataFromDB = async (
  systemId: SystemId,
  entries: Entry[],
) => {
  const dbPath = nodepath.join(
    __dirname,
    "..",
    "fetchMetaData",
    "systems",
    `${systemId}.json`,
  );

  const data: Game[] = JSON.parse(await readFile(dbPath, { encoding: "utf8" }));

  return parseData(entries, data);
};
