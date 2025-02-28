import type { Category } from "../types/jsonFiles/category";
import nodepath from "path";
import { syncLastPlayedWithCategoryCached } from "./lastPlayed.server";
import type { SystemId } from "./categoriesDB.server/systemId";
import { MultipleFileDataCache } from "./FileDataCache.server";
import fs from "fs";

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

export const deleteCategoryConfigFiles = () => {
  if (fs.existsSync(entriesPath)) {
    fs.rmSync(entriesPath, { recursive: true, force: true });
    fs.mkdirSync(entriesPath);
  }
};
