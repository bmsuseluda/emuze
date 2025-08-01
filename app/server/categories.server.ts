import nodepath from "node:path";

import type { CategorySlim } from "../types/jsonFiles/categories.js";
import { readDirectorynames } from "./readWriteData.server.js";
import { sortCaseInsensitive } from "./sortCaseInsensitive.server.js";
import { readGeneral } from "./settings.server.js";
import { getCategoryDataByName } from "./categoriesDB.server/index.js";
import { FileDataCache } from "./FileDataCache.server.js";
import type { CategoryImportData } from "./importCategory.server.js";
import { importCategory } from "./importCategory.server.js";
import { setImportIsRunning } from "./importIsRunning.server.js";
import { readCategory } from "./categoryDataCache.server.js";

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
  setImportIsRunning(true);
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

    writeCategories(
      categoryImportDataList.filter(
        ({ categoryDbData }) =>
          readCategory(categoryDbData.id)?.entries?.length || 0 > 0,
      ),
    );
    setImportIsRunning(false);
  }
};
