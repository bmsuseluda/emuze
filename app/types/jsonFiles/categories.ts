import type { PlatformId } from "~/server/categoriesDB.server";

export interface Category {
  id: PlatformId;
  name: string;
}
