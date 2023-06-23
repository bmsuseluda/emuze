import fs from "fs";
import nodepath from "path";

import type { Category as CategorySlim } from "~/types/jsonFiles/categories";
import type { Category, Entry } from "~/types/jsonFiles/category";
import {
  readDirectorynames,
  readFilenames,
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
import {
  FileDataCache,
  MultipleFileDataCache,
} from "~/server/FileDataCache.server";

export const paths = {
  categories: "data/categories.json",
  entries: "data/categories/",
};

const categoriesDataCache = new FileDataCache<CategorySlim[]>(paths.categories);

export const readCategories = () => categoriesDataCache.readFile() || [];

const writeCategories = (categories: Category[]) => {
  const categoriesSlim = categories.map<CategorySlim>(({ id, name }) => ({
    id,
    name,
  }));
  categoriesDataCache.writeFile(categoriesSlim);
};

const deleteCategories = () => {
  if (fs.existsSync(paths.entries)) {
    fs.rmSync(paths.entries, { recursive: true, force: true });
    fs.mkdirSync(paths.entries);
  }
  writeCategories([]);
};

const categoryDataCache = new MultipleFileDataCache<Category>();

export const readCategory = (categoryId: string) =>
  categoryDataCache.readFile(
    nodepath.join(paths.entries, `${categoryId}.json`)
  );

export const writeCategory = (category: Category) =>
  categoryDataCache.writeFile(
    category,
    nodepath.join(paths.entries, `${category.id}.json`)
  );

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
      const now = new Date().getTime();
      if (oldEntryData?.metaData && oldEntryData?.metaData?.expiresOn > now) {
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
  const generalData = readGeneral();

  if (oldCategoryData && categoryDbData && generalData) {
    const { applicationsPath } = generalData;
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
  const generalData = readGeneral();

  if (generalData?.categoriesPath) {
    const { categoriesPath, applicationsPath } = generalData;
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
