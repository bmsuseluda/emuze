import type { SystemId } from "~/server/categoriesDB.server/types";

export interface Category {
  id: SystemId;
  name: string;
}
