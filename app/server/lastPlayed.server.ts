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

export const addToLastPlayedCached = (entry: Entry, systemId: SystemId) => {
  const lastPlayed = readLastPlayed();

  const updatedList = addToLastPlayed(lastPlayed, entry, systemId);

  writeLastPlayed(updatedList);
};

export const addToLastPlayed = (
  lastPlayed: EntryWithSystem[],
  entryToAdd: Entry,
  systemId: SystemId,
) => {
  const lastPlayedUpdated = [...lastPlayed];
  const index = lastPlayedUpdated.findIndex(
    (lastPlayedGame) =>
      lastPlayedGame.id === entryToAdd.id &&
      lastPlayedGame.systemId === systemId,
  );

  const newEntry: EntryWithSystem = {
    ...entryToAdd,
    systemId,
    lastPlayed: new Date().getTime(),
  };

  if (index >= 0) {
    lastPlayedUpdated[index] = newEntry;
  } else {
    lastPlayedUpdated.push(newEntry);
  }

  lastPlayedUpdated.sort(sortLastPlayed);

  return lastPlayedUpdated.slice(0, 50);
};
