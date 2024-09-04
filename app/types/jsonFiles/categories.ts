import type { SystemId } from "../../server/categoriesDB.server/systemId";

export interface CategorySlim {
  id: SystemId;
  name: string;
}
