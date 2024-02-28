import type { PlatformId } from "~/server/categoriesDB.server/types";

export interface Category {
  id: PlatformId;
  name: string;
}
