import nodepath from "path";

import type { CategorySlim } from "../types/jsonFiles/categories";
import type { Category } from "../types/jsonFiles/category";
import { readDirectorynames } from "./readWriteData.server";
import { sortCaseInsensitive } from "./sortCaseInsensitive.server";
import { readGeneral } from "./settings.server";
import { getCategoryDataByName } from "./categoriesDB.server";
import { FileDataCache } from "./FileDataCache.server";
import {
  createCategoryData,
  createCategoryDataWithMetaData,
} from "./importCategory.server";
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

    const categories = categoryFolderNames.reduce<Category[]>(
      (result, categoryFolderName) => {
        const categoryFolderBasename = nodepath.basename(categoryFolderName);
        const categoryDbData = getCategoryDataByName(categoryFolderBasename);

        if (categoryDbData) {
          const categoryData = createCategoryData(
            categoryDbData,
            categoryFolderBasename,
            applicationsPath,
          );
          if (categoryData.entries && categoryData.entries.length > 0) {
            result.push(categoryData);
          }
        }

        return result;
      },
      [],
    );

    const categoriesWithUpdatedMetaData = categories.map(
      createCategoryDataWithMetaData,
    );

    deleteCategories();
    categoriesWithUpdatedMetaData.forEach((category) => {
      writeCategory(category);
    });
    writeCategories(categoriesWithUpdatedMetaData);
  }
};
