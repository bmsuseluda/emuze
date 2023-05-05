import fs from "fs";
import nodepath from "path";

import type { Category as CategorySlim } from "~/types/jsonFiles/categories";
import type { Category, Entry } from "~/types/jsonFiles/category";
import {
  readDirectorynames,
  readFileHome,
  readFilenames,
  writeFileHome,
} from "~/server/readWriteData.server";
import { convertToId } from "~/server/convertToId.server";
import { sortCaseInsensitive } from "~/server/sortCaseInsensitive.server";
import { fetchMetaData } from "~/server/igdb.server";
import { readGeneral } from "~/server/settings.server";
import { getApplicationDataById } from "~/server/applicationsDB.server";
import type { PlatformId } from "~/server/categoriesDB.server";
import {
  categories,
  getCategoryDataByName,
} from "~/server/categoriesDB.server";

export const paths = {
  categories: "data/categories.json",
  entries: "data/categories/",
};

export const readCategories = (): CategorySlim[] => {
  const categories = readFileHome(paths.categories);

  if (categories) {
    return categories;
  }
  return [];
};

const writeCategories = (categories: Category[]) => {
  const categoriesSlim = categories.map<CategorySlim>(({ id, name }) => ({
    id,
    name,
  }));
  writeFileHome(categoriesSlim, paths.categories);
};

const deleteCategories = () => {
  if (fs.existsSync(paths.entries)) {
    fs.rmSync(paths.entries, { recursive: true, force: true });
    fs.mkdirSync(paths.entries);
  }
  writeCategories([]);
};

export const readCategory = (category: string): Category | null =>
  readFileHome(nodepath.join(paths.entries, `${category}.json`));

const writeCategory = (category: Category) =>
  writeFileHome(category, nodepath.join(paths.entries, `${category.id}.json`));

const sortFileNames = (a: string, b: string) => {
  const aWithoutPath = nodepath.basename(a);
  const bWithoutPath = nodepath.basename(b);
  const aExtname = nodepath.extname(aWithoutPath);
  const bExtname = nodepath.extname(bWithoutPath);
  const aWithoutFileExtension = aWithoutPath.split(aExtname)[0];
  const bWithoutFileExtension = bWithoutPath.split(bExtname)[0];
  return sortCaseInsensitive(aWithoutFileExtension, bWithoutFileExtension);
};

const sortEntries = (a: Entry, b: Entry) => sortFileNames(a.path, b.path);

const filterFiles = (filenames: string[], filesToFilter?: string[]) => {
  if (filesToFilter) {
    return filenames.filter(
      (filename) => !filesToFilter.includes(nodepath.basename(filename))
    );
  }

  return filenames;
};

export const readEntriesWithMetaData = async (
  categoryId: string,
  entryPath: string,
  igdbPlatformIds: number[],
  applicationId: string,
  oldEntries?: Entry[]
) => {
  const applicationData = getApplicationDataById(applicationId);

  if (applicationData) {
    const filenames = readFilenames(entryPath, applicationData.fileExtensions);

    const { findEntryName, filteredFiles } = applicationData;

    const filenamesFiltered = filterFiles(filenames, filteredFiles);

    const entriesWithMetaData: Entry[] = [];
    const entriesWithoutMetaData: Entry[] = [];

    filenamesFiltered.forEach((filename, index) => {
      const extension = nodepath.extname(filename);
      const [name] = nodepath.basename(filename).split(extension);

      const oldEntryData = oldEntries?.find(({ path }) => path === filename);
      // TODO: create metaData object with 'expiresOn'
      if (oldEntryData?.imageUrl) {
        entriesWithMetaData.push(oldEntryData);
      } else {
        const entry = {
          id: convertToId(name, index),
          name,
          path: filename,
        };

        if (findEntryName) {
          entriesWithoutMetaData.push({
            ...entry,
            name: findEntryName(entry, entryPath),
          });
        } else {
          entriesWithoutMetaData.push(entry);
        }
      }
    });

    return [
      ...entriesWithMetaData,
      ...(await fetchMetaData(igdbPlatformIds, entriesWithoutMetaData)),
    ].sort(sortEntries);
  }
};

export const importEntries = async (category: string) => {
  const oldData = readCategory(category);
  const categoryDbData = categories[category as PlatformId];

  if (oldData && categoryDbData) {
    const { entryPath, applicationId } = oldData;
    const data: Category = {
      ...oldData,
      entries: await readEntriesWithMetaData(
        category,
        entryPath,
        categoryDbData.igdbPlatformIds,
        applicationId,
        oldData.entries
      ),
    };

    writeCategory(data);
  }
};

/**
 * const installedApplicationsForCategory
 * const oldApplicationId
 * const defaultApplicationId
 *
 * if (oldApplicationId is in installedApplicationsForCategory) {
 *     return oldApplicationId
 * }
 *
 * if (defaultApplicationId is in installedApplicationsForCategory) {
 *     return defaultApplicationId
 * }
 *
 * if (installedApplicationsForCategory.length > 0) {
 *     return installedApplicationsForCategory[0].id
 * }
 *
 * return defaultApplicationId
 */
const getApplicationIdForCategory = () => {};

const createCategoryData =
  (
    applicationId: string,
    igdbPlatformIds: number[],
    categoryFolderName: string,
    categoryFolderBaseName: string,
    categoryId: PlatformId
  ) =>
  async (): Promise<Category> => {
    const oldCategoryData = readCategory(categoryId);

    const entries = await readEntriesWithMetaData(
      categoryId,
      categoryFolderName,
      igdbPlatformIds,
      applicationId,
      oldCategoryData?.entries
    );

    return {
      id: categoryId,
      name: categoryFolderBaseName,
      applicationId: oldCategoryData?.applicationId || applicationId,
      applicationPath: oldCategoryData?.applicationPath,
      entryPath: categoryFolderName,
      entries,
    };
  };

export const importCategories = async () => {
  const { categoriesPath } = readGeneral();

  if (categoriesPath) {
    const categoryFolderNames = readDirectorynames(categoriesPath);
    categoryFolderNames.sort(sortCaseInsensitive);

    const getSupportedCategories = categoryFolderNames.reduce<
      Array<() => Promise<Category>>
    >((previousValue, categoryFolderName) => {
      const categoryFolderBasename = nodepath.basename(categoryFolderName);
      const categoryDbData = getCategoryDataByName(categoryFolderBasename);

      if (categoryDbData) {
        const { id, igdbPlatformIds, defaultApplication } = categoryDbData;

        previousValue.push(
          createCategoryData(
            defaultApplication.id,
            igdbPlatformIds,
            categoryFolderName,
            categoryFolderBasename,
            id
          )
        );
      }

      return previousValue;
    }, []);

    const supportedCategories = (
      await Promise.all(getSupportedCategories.map((func) => func()))
    ).filter(({ entries }) => entries && entries.length > 0);

    deleteCategories();
    supportedCategories.forEach((category) => {
      writeCategory(category);
    });
    writeCategories(supportedCategories);
  }
};
