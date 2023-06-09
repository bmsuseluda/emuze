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
import type { ApplicationId } from "~/server/applicationsDB.server";
import { getApplicationDataById } from "~/server/applicationsDB.server";
import type {
  Category as CategoryDB,
  PlatformId,
} from "~/server/categoriesDB.server";
import {
  categories,
  getCategoryDataByName,
} from "~/server/categoriesDB.server";
import { getInstalledApplicationForCategory } from "~/server/applications.server";

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

export const writeCategory = (category: Category) =>
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
  applicationId: ApplicationId,
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
  const categoryDbData = categories[category as PlatformId];
  const oldCategoryData = readCategory(category);

  if (oldCategoryData && categoryDbData) {
    const { applicationsPath } = readGeneral();
    const { igdbPlatformIds, defaultApplication } = categoryDbData;
    const application = getInstalledApplicationForCategory({
      applicationsPath,
      defaultApplicationDB: defaultApplication,
      oldApplication: oldCategoryData?.application,
    });

    const entries = await readEntriesWithMetaData(
      category,
      oldCategoryData.entryPath,
      igdbPlatformIds,
      application?.id || defaultApplication.id,
      oldCategoryData.entries
    );

    writeCategory({
      ...oldCategoryData,
      application,
      entries,
    });
  }
};

const createCategoryData =
  (
    categoryDbData: CategoryDB,
    categoryFolderName: string,
    categoryFolderBaseName: string,
    applicationsPath?: string
  ) =>
  async (): Promise<Category> => {
    const { id, igdbPlatformIds, defaultApplication } = categoryDbData;
    const oldCategoryData = readCategory(id);

    const application = getInstalledApplicationForCategory({
      applicationsPath,
      defaultApplicationDB: defaultApplication,
      oldApplication: oldCategoryData?.application,
    });

    const entries = await readEntriesWithMetaData(
      id,
      categoryFolderName,
      igdbPlatformIds,
      application?.id || defaultApplication.id,
      oldCategoryData?.entries
    );

    return {
      ...oldCategoryData,
      id,
      name: categoryFolderBaseName,
      application,
      entryPath: categoryFolderName,
      entries,
    };
  };

export const importCategories = async () => {
  const { categoriesPath, applicationsPath } = readGeneral();

  if (categoriesPath) {
    const categoryFolderNames = readDirectorynames(categoriesPath);
    categoryFolderNames.sort(sortCaseInsensitive);

    const getSupportedCategories = categoryFolderNames.reduce<
      Array<() => Promise<Category>>
    >((result, categoryFolderName) => {
      const categoryFolderBasename = nodepath.basename(categoryFolderName);
      const categoryDbData = getCategoryDataByName(categoryFolderBasename);

      if (categoryDbData) {
        result.push(
          createCategoryData(
            categoryDbData,
            categoryFolderName,
            categoryFolderBasename,
            applicationsPath
          )
        );
      }

      return result;
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
