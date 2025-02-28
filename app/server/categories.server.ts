import nodepath from "path";

import type { CategorySlim } from "../types/jsonFiles/categories";
import type { Category } from "../types/jsonFiles/category";
import { readDirectorynames } from "./readWriteData.server";
import { sortCaseInsensitive } from "./sortCaseInsensitive.server";
import { readGeneral } from "./settings.server";
import { getCategoryDataByName } from "./categoriesDB.server";
import { FileDataCache } from "./FileDataCache.server";
import type { CategoryImportData } from "./importCategory.server";
import { importCategory } from "./importCategory.server";
import {
  deleteCategoryConfigFiles,
  writeCategory,
} from "./categoryDataCache.server";

export const paths = {
  categories: "data/categories.json",
};

const categoriesDataCache = new FileDataCache<CategorySlim[]>(
  paths.categories,
  [],
);
export const readCategories = () => categoriesDataCache.readFile() || [];
const writeCategories = (categories: Category[]) => {
  const categoriesSlim = categories.map<CategorySlim>(({ id, name }) => ({
    id,
    name,
  }));
  categoriesDataCache.writeFile(categoriesSlim);
};
export const invalidateCategoriesDataCache = () => {
  categoriesDataCache.invalidateCache();
};

const deleteCategories = () => {
  deleteCategoryConfigFiles();
  writeCategories([]);
};

export const importCategories = () => {
  const generalData = readGeneral();

  if (generalData?.categoriesPath) {
    const { categoriesPath, applicationsPath } = generalData;
    const categoryFolderNames = readDirectorynames(categoriesPath);
    categoryFolderNames.sort(sortCaseInsensitive);

    // TODO: check if the following is necessary anymore
    // if (categoryData.entries && categoryData.entries.length > 0) {

    const categoryImportDataList = categoryFolderNames.reduce<
      CategoryImportData[]
    >((result, categoryFolderName) => {
      const categoryFolderBaseName = nodepath.basename(categoryFolderName);
      const categoryDbData = getCategoryDataByName(categoryFolderBaseName);

      if (categoryDbData) {
        result.push({
          categoryDbData,
          categoryFolderBaseName,
          applicationsPath,
        });
      }

      return result;
    }, []);

    const categoriesWithUpdatedMetaData =
      categoryImportDataList.map(importCategory);

    deleteCategories();
    categoriesWithUpdatedMetaData.forEach((category) => {
      writeCategory(category);
    });
    writeCategories(categoriesWithUpdatedMetaData);
  }
};
