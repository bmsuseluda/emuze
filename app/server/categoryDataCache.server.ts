import type { Category } from "../types/jsonFiles/category.js";
import nodepath from "node:path";
import { syncLastPlayedWithCategoryCached } from "./lastPlayed.server.js";
import type { SystemId } from "./categoriesDB.server/systemId.js";
import { MultipleFileDataCache } from "./FileDataCache.server.js";

export const entriesPath = "data/categories/";

const categoryDataCache = new MultipleFileDataCache<Category>();
export const readCategory = (categoryId: SystemId) =>
  categoryDataCache.readFile(nodepath.join(entriesPath, `${categoryId}.json`));
export const writeCategory = (category: Category) => {
  categoryDataCache.writeFile(
    category,
    nodepath.join(entriesPath, `${category.id}.json`),
  );
  syncLastPlayedWithCategoryCached(category);
};
export const invalidateCategoryDataCache = () => {
  categoryDataCache.invalidateCache();
};
