import type { Entry } from "./category";
import type { SystemId } from "../../server/categoriesDB.server/systemId";

export interface EntryWithSystem extends Entry {
  systemId: SystemId;
  /**
   * Timestamp when the game was played last
   */
  lastPlayed: number;
}

export const isEntryWithSystem = (
  game: Entry | EntryWithSystem,
): game is EntryWithSystem => "systemId" in game;
