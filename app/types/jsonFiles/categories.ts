import type { SystemId } from "../../server/categoriesDB.server/systemId.js";

export interface CategorySlim {
  id: SystemId;
  name: string;
}
