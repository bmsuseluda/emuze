import { FileDataCache } from "./FileDataCache.server";
import type { EntryWithSystem } from "../types/jsonFiles/lastPlayed";
import type { Entry } from "../types/jsonFiles/category";
import type { SystemId } from "./categoriesDB.server/systemId";
import { sortDateTime } from "./sortCaseInsensitive.server";

export const paths = {
  lastPlayed: "data/lastPlayed.json",
};

const lastPlayedDataCache = new FileDataCache<EntryWithSystem[]>(
  paths.lastPlayed,
);

export const readLastPlayed = () => lastPlayedDataCache.readFile() || [];

/**
 * lastPlayed list needs to be
 * - sorted by last played
 * - unique, so no duplicate entries in it
 * - limited on 30 items
 */
export const writeLastPlayed = (entries: EntryWithSystem[]) => {
  lastPlayedDataCache.writeFile(entries);
};

const sortLastPlayed = (a: EntryWithSystem, b: EntryWithSystem) =>
  sortDateTime(a.lastPlayed, b.lastPlayed);

export const addToLastPlayed = (entry: Entry, systemId: SystemId) => {
  const lastPlayed = [...readLastPlayed()];
  const index = lastPlayed.findIndex(
    (lastPlayedGame) =>
      lastPlayedGame.id === entry.id && lastPlayedGame.systemId === systemId,
  );

  const newEntry: EntryWithSystem = {
    ...entry,
    systemId,
    lastPlayed: new Date().getTime(),
  };

  if (index >= 0) {
    lastPlayed[index] = newEntry;
  } else {
    lastPlayed.push(newEntry);
  }

  lastPlayed.sort(sortLastPlayed);

  writeLastPlayed(lastPlayed.slice(0, 50));
};
