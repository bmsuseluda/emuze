import type { Entry } from "./category.js";
import type { SystemId } from "../../server/categoriesDB.server/systemId.js";

export interface EntryWithSystem extends Entry {
  systemId: SystemId;
  /**
   * Timestamp when the game was played last
   */
  lastPlayed: number;
  subEntries?: Entry[];
}

export const isEntryWithSystem = (
  game: Entry | EntryWithSystem,
): game is EntryWithSystem => "systemId" in game;
