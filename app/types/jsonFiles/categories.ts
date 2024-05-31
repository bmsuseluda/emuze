import type { SystemId } from "../../server/categoriesDB.server/systemId";

export interface Category {
  id: SystemId;
  name: string;
}
