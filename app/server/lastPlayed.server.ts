import { FileDataCache } from "./FileDataCache.server";
import type { EntryWithSystem } from "../types/jsonFiles/lastPlayed";
import type { Category, Entry } from "../types/jsonFiles/category";
import type { SystemId } from "./categoriesDB.server/systemId";
import { sortDateTime } from "./sortCaseInsensitive.server";
import { convertToId } from "./convertToId.server";

export const paths = {
  lastPlayed: "data/lastPlayed.json",
};

const lastPlayedDataCache = new FileDataCache<EntryWithSystem[]>(
  paths.lastPlayed,
  [],
);
export const readLastPlayed = () => lastPlayedDataCache.readFile() || [];
/**
 * lastPlayed list needs to be
 * - sorted by last played
 * - unique, so no duplicate entries in it
 * - limited to 50 items
 */
export const writeLastPlayed = (entries: EntryWithSystem[]) => {
  lastPlayedDataCache.writeFile(entries);
};
export const invalidateLastPlayedDataCache = () => {
  lastPlayedDataCache.invalidateCache();
};

const sortLastPlayed = (a: EntryWithSystem, b: EntryWithSystem) =>
  sortDateTime(a.lastPlayed, b.lastPlayed);

const unifyIds = (lastPlayed: EntryWithSystem[]) =>
  lastPlayed.map<EntryWithSystem>((lastPlayedGame, index) => ({
    ...lastPlayedGame,
    id: convertToId(lastPlayedGame.name, index),
  }));

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
      lastPlayedGame.path === entryToAdd.path &&
      lastPlayedGame.systemId === systemId,
  );

  const newEntry: EntryWithSystem = {
    ...entryToAdd,
    systemId,
    lastPlayed: Date.now(),
  };

  if (index >= 0) {
    lastPlayedUpdated[index] = newEntry;
  } else {
    lastPlayedUpdated.push(newEntry);
  }

  lastPlayedUpdated.sort(sortLastPlayed);
  const lastPlayedShortend = lastPlayedUpdated.slice(0, 50);

  return unifyIds(lastPlayedShortend);
};

export const syncLastPlayedWithCategoryCached = (category: Category) => {
  const lastPlayed = readLastPlayed();

  const updatedList = syncLastPlayedWithCategory(lastPlayed, category);

  writeLastPlayed(updatedList);
};

export const syncLastPlayedWithCategory = (
  lastPlayed: EntryWithSystem[],
  category: Category,
) => {
  const lastPlayedUpdated: EntryWithSystem[] = [];

  lastPlayed.forEach((lastPlayedGame) => {
    if (lastPlayedGame.systemId !== category.id) {
      lastPlayedUpdated.push(lastPlayedGame);
    } else {
      const newEntry = category.entries?.find(
        (entryFromCategory) =>
          entryFromCategory.path === lastPlayedGame.path ||
          !!entryFromCategory.subEntries?.find(
            (entryFromCategory) =>
              entryFromCategory.path === lastPlayedGame.path,
          ),
      );

      if (newEntry) {
        lastPlayedUpdated.push({
          ...lastPlayedGame,
          ...newEntry,
        });
      }
    }
  });

  return unifyIds(lastPlayedUpdated);
};
