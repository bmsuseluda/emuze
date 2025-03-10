import nodepath from "path";

import type { CategorySlim } from "../types/jsonFiles/categories";
import { readDirectorynames } from "./readWriteData.server";
import { sortCaseInsensitive } from "./sortCaseInsensitive.server";
import { readGeneral } from "./settings.server";
import { getCategoryDataByName } from "./categoriesDB.server";
import { FileDataCache } from "./FileDataCache.server";
import type { CategoryImportData } from "./importCategory.server";
import { importCategory } from "./importCategory.server";

export const paths = {
  categories: "data/categories.json",
};

const categoriesDataCache = new FileDataCache<CategorySlim[]>(
  paths.categories,
  [],
);
export const readCategories = () => categoriesDataCache.readFile() || [];
const writeCategories = (categoryImportDataList: CategoryImportData[]) => {
  const categoriesSlim = categoryImportDataList.map<CategorySlim>(
    ({ categoryDbData: { id }, categoryFolderBaseName }) => ({
      id,
      name: categoryFolderBaseName,
    }),
  );
  categoriesDataCache.writeFile(categoriesSlim);
};
export const invalidateCategoriesDataCache = () => {
  categoriesDataCache.invalidateCache();
};

export const importCategories = async () => {
  const generalData = readGeneral();

  if (generalData?.categoriesPath) {
    const { categoriesPath, applicationsPath } = generalData;
    const categoryFolderNames = readDirectorynames(categoriesPath);
    categoryFolderNames.sort(sortCaseInsensitive);

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

    for (const categoryImportData of categoryImportDataList) {
      await importCategory(categoryImportData);
    }
    writeCategories(categoryImportDataList);
  }
};
