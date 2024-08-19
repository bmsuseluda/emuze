import type { Entry } from "./category";
import type { SystemId } from "../../server/categoriesDB.server/systemId";

export interface EntryWithSystem extends Entry {
  systemId: SystemId;
  lastPlayed: number;
}
