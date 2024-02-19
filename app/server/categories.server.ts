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
import { applications } from "~/server/applicationsDB.server";
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
import { openErrorDialog } from "~/server/openDialog.server";

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
    nodepath.join(paths.entries, `${categoryId}.json`),
  );

export const writeCategory = (category: Category) =>
  categoryDataCache.writeFile(
    {
      ...category,
      application: category.application?.id
        ? {
            id: category.application.id,
            path: category.application.path,
          }
        : undefined,
    },
    nodepath.join(paths.entries, `${category.id}.json`),
  );

const sortEntries = (a: Entry, b: Entry) => sortCaseInsensitive(a.name, b.name);

const filterFiles = (filenames: string[], filesToFilter?: string[]) => {
  if (filesToFilter) {
    return filenames.filter(
      (filename) =>
        !filesToFilter.find((fileToFilter) =>
          nodepath
            .basename(filename)
            .toLowerCase()
            .includes(fileToFilter.toLowerCase()),
        ),
    );
  }

  return filenames;
};

export const readEntries = (
  categoryName: string,
  applicationId: ApplicationId,
  oldEntries?: Entry[],
) => {
  const applicationData = applications[applicationId];
  const generalData = readGeneral();

  if (applicationData && generalData?.categoriesPath) {
    const categoriesPath = generalData.categoriesPath;
    const categoryPath = nodepath.join(categoriesPath, categoryName);
    const filenames = readFilenames({
      path: categoryPath,
      fileExtensions: applicationData.fileExtensions,
      entryAsDirectory: applicationData.entryAsDirectory,
    });

    const { findEntryName, filteredFiles } = applicationData;

    const filenamesFiltered = filterFiles(filenames, filteredFiles);

    return filenamesFiltered
      .map<Entry>((filename, index) => {
        const extension = nodepath.extname(filename);
        const name =
          extension.length > 0
            ? nodepath.basename(filename).split(extension)[0]
            : nodepath.basename(filename);

        const oldEntryData = oldEntries?.find(({ path }) => path === filename);
        if (oldEntryData) {
          return oldEntryData;
        } else {
          const entry = {
            id: convertToId(name, index),
            name,
            path: nodepath.relative(categoryPath, filename),
          };

          if (findEntryName) {
            return {
              ...entry,
              name: findEntryName({ entry, categoriesPath, categoryName }),
            };
          } else {
            return entry;
          }
        }
      })
      .sort(sortEntries);
  }

  return oldEntries || [];
};

export const readEntriesWithMetaData = async (
  igdbPlatformIds: number[],
  entries: Entry[],
) => {
  const entriesWithMetaData: Entry[] = [];
  const entriesWithoutMetaData: Entry[] = [];

  entries.forEach((entry) => {
    const now = new Date().getTime();
    if (entry.metaData && entry.metaData?.expiresOn > now) {
      entriesWithMetaData.push(entry);
    } else {
      entriesWithoutMetaData.push({ ...entry, metaData: undefined });
    }
  });

  return [
    ...entriesWithMetaData,
    ...(await fetchMetaData(igdbPlatformIds, entriesWithoutMetaData)),
  ].sort(sortEntries);
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

    const entries = readEntries(
      oldCategoryData.name,
      application?.id || defaultApplication.id,
      oldCategoryData.entries,
    );

    await readEntriesWithMetaData(igdbPlatformIds, entries)
      .then((entries) => {
        writeCategory({
          ...oldCategoryData,
          application,
          entries,
        });
      })
      .catch((error) => {
        openErrorDialog(
          "Please try again later",
          "Fetch covers from igdb failed",
        );
        console.log("igdb error", error);
        writeCategory({
          ...oldCategoryData,
          application,
          entries,
        });
      });
  }
};

const createCategoryDataWithMetaData =
  (category: Category) => async (): Promise<Category> => {
    const categoryDbData = getCategoryDataByName(category.name);
    if (category.entries && categoryDbData) {
      return readEntriesWithMetaData(
        categoryDbData.igdbPlatformIds,
        category.entries,
      ).then((entries) => ({
        ...category,
        entries,
      }));
    }
    return category;
  };

const createCategoryData = (
  categoryDbData: CategoryDB,
  categoryFolderBaseName: string,
  applicationsPath?: string,
): Category => {
  const { id, defaultApplication } = categoryDbData;
  const oldCategoryData = readCategory(id);

  const application = getInstalledApplicationForCategory({
    applicationsPath,
    defaultApplicationDB: defaultApplication,
    oldApplication: oldCategoryData?.application,
  });

  const entries = readEntries(
    categoryFolderBaseName,
    application?.id || defaultApplication.id,
    oldCategoryData?.entries,
  );

  return {
    ...oldCategoryData,
    id,
    name: categoryFolderBaseName,
    application,
    entries,
  };
};

export const importCategories = async () => {
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

    const getCategoriesWithMetaData = categories.map<() => Promise<Category>>(
      (category) => createCategoryDataWithMetaData(category),
    );

    await Promise.allSettled(
      getCategoriesWithMetaData.map((func) => func()),
    ).then((settledResult) => {
      const categoriesWithUpdatedMetaData = settledResult.map(
        (categorySettledResult, index) => {
          if (categorySettledResult.status === "fulfilled") {
            return categorySettledResult.value;
          }

          console.log("igdb error", categorySettledResult.reason);
          return categories[index];
        },
      );

      deleteCategories();
      categoriesWithUpdatedMetaData.forEach((category) => {
        writeCategory(category);
      });
      writeCategories(categoriesWithUpdatedMetaData);

      if (
        settledResult.find(
          (categorySettledResult) =>
            categorySettledResult.status === "rejected",
        )
      ) {
        openErrorDialog(
          "Please try again later",
          "Fetch covers from igdb failed",
        );
      }
    });
  }
};
