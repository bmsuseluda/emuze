import fs from "fs";
import nodepath from "path";

import type { CategorySlim } from "../types/jsonFiles/categories";
import type { Category, Entry } from "../types/jsonFiles/category";
import { readDirectorynames, readFilenames } from "./readWriteData.server";
import { convertToId } from "./convertToId.server";
import { sortCaseInsensitive } from "./sortCaseInsensitive.server";
import { fetchMetaData } from "./igdb.server";
import { readGeneral } from "./settings.server";
import type {
  ExcludeFilesFunction,
  FindEntryNameFunction,
  InstalledApplication,
} from "./applicationsDB.server/types";
import { applications } from "./applicationsDB.server";
import type { Category as CategoryDB } from "./categoriesDB.server/types";
import { categories, getCategoryDataByName } from "./categoriesDB.server";
import { getInstalledApplicationForCategory } from "./applications.server";
import { FileDataCache, MultipleFileDataCache } from "./FileDataCache.server";
import { setErrorDialog } from "./errorDialog.server";
import type { ApplicationId } from "./applicationsDB.server/applicationId";
import type { SystemId } from "./categoriesDB.server/systemId";
import { log } from "./debug.server";
import { syncLastPlayedWithCategoryCached } from "./lastPlayed.server";

export const paths = {
  categories: "data/categories.json",
  entries: "data/categories/",
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
  if (fs.existsSync(paths.entries)) {
    fs.rmSync(paths.entries, { recursive: true, force: true });
    fs.mkdirSync(paths.entries);
  }
  writeCategories([]);
};

const categoryDataCache = new MultipleFileDataCache<Category>();
export const readCategory = (categoryId: SystemId) =>
  categoryDataCache.readFile(
    nodepath.join(paths.entries, `${categoryId}.json`),
  );
export const writeCategory = (category: Category) => {
  categoryDataCache.writeFile(
    category,
    nodepath.join(paths.entries, `${category.id}.json`),
  );
  syncLastPlayedWithCategoryCached(category);
};
export const invalidateCategoryDataCache = () => {
  categoryDataCache.invalidateCache();
};

const sortEntries = (a: Entry, b: Entry) => sortCaseInsensitive(a.name, b.name);

const filterFiles = (
  filenames: string[],
  excludeFiles?: ExcludeFilesFunction,
) => {
  if (excludeFiles) {
    const filesToExclude = excludeFiles(filenames);
    return filenames.filter(
      (filename) =>
        !filesToExclude.find((fileToExclude) =>
          filename.toLowerCase().includes(fileToExclude.toLowerCase()),
        ),
    );
  }

  return filenames;
};

interface EntryWithoutSubEntries extends Entry {
  subEntries?: never;
}

const createEntry = ({
  filename,
  categoryPath,
  categoriesPath,
  categoryName,
  index,
  oldEntries,
  installedApplication,
  findEntryName,
}: {
  filename: string;
  categoryPath: string;
  categoriesPath: string;
  categoryName: string;
  index: number;
  oldEntries?: Entry[];
  installedApplication?: InstalledApplication;
  findEntryName?: FindEntryNameFunction;
}): EntryWithoutSubEntries => {
  const now = Date.now();
  const oldData = oldEntries?.find(
    ({ path }) => path === nodepath.relative(categoryPath, filename),
  );
  const oldMetaData = oldData?.metaData;

  if (oldMetaData && oldMetaData.expiresOn > now) {
    return { ...oldData, subEntries: undefined };
  }

  const name = filterGameNameFromFileName(filename);
  const path = nodepath.relative(categoryPath, filename);
  const entry: EntryWithoutSubEntries = {
    id: convertToId(name, index),
    name,
    path,
    ...(oldMetaData && { metaData: oldMetaData }),
  };

  if (findEntryName) {
    const optimizedName = findEntryName({
      entry,
      categoriesPath,
      categoryName,
      installedApplication,
    });
    return {
      ...entry,
      name: optimizedName,
    };
  }

  return entry;
};

const filterGameNameFromFileName = (fileName: string) => {
  const extension = nodepath.extname(fileName);
  return extension.length > 0
    ? nodepath.basename(fileName).split(extension)[0]
    : nodepath.basename(fileName);
};

const removeAdditionalInfo = (gameName: string) => gameName.split(" (")[0];

const isSameBaseGame = (gameName: string, lastGameName?: string) =>
  lastGameName &&
  removeAdditionalInfo(gameName).toLowerCase().trim() ===
    removeAdditionalInfo(lastGameName).toLowerCase().trim();

const addAsGameVersion = (lastEntry: Entry, { metaData, ...entry }: Entry) => {
  const { metaData: metaDataFromLast, ...lastEntryWithoutMetaData } = lastEntry;
  if (lastEntry.subEntries?.[0]) {
    lastEntry.subEntries.push(entry);
  } else {
    lastEntry.subEntries = [{ ...lastEntryWithoutMetaData }, entry];
  }
};

export const readEntries = ({
  categoryName,
  applicationId,
  installedApplication,
  oldEntries,
}: {
  categoryName: string;
  applicationId: ApplicationId;
  installedApplication?: InstalledApplication;
  oldEntries?: Entry[];
}) => {
  const applicationDbData = applications[applicationId];
  const generalData = readGeneral();

  if (applicationDbData && generalData?.categoriesPath) {
    const { findEntryName, excludeFiles, fileExtensions, entryAsDirectory } =
      applicationDbData;

    const categoriesPath = generalData.categoriesPath;
    const categoryPath = nodepath.join(categoriesPath, categoryName);
    const filenames = readFilenames({
      path: categoryPath,
      fileExtensions,
      entryAsDirectory,
    });

    const filenamesFiltered = filterFiles(filenames, excludeFiles);

    return filenamesFiltered
      .map((filename, index) =>
        createEntry({
          oldEntries,
          categoriesPath,
          categoryName,
          index,
          categoryPath,
          filename,
          findEntryName,
          installedApplication,
        }),
      )
      .sort(sortEntries)
      .reduce<Entry[]>((entries, entry) => {
        const lastEntry = entries.at(-1);

        if (lastEntry && isSameBaseGame(entry.name, lastEntry?.name)) {
          addAsGameVersion(lastEntry, entry);
        } else {
          entries.push(entry);
        }

        return entries;
      }, []);
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
    const now = Date.now();
    if (entry.metaData && entry.metaData.expiresOn > now) {
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

export const importEntries = async (category: SystemId) => {
  const categoryDbData = categories[category];
  const oldCategoryData = readCategory(category);
  const generalData = readGeneral();

  if (oldCategoryData && categoryDbData && generalData) {
    const { applicationsPath } = generalData;
    const { igdbPlatformIds } = categoryDbData;

    const application = getInstalledApplicationForCategory({
      applicationsPath,
      categoryDB: categoryDbData,
    });

    const entries = readEntries({
      categoryName: oldCategoryData.name,
      applicationId: application?.id || categoryDbData.application.id,
      installedApplication: application,
      oldEntries: oldCategoryData.entries,
    });

    await readEntriesWithMetaData(igdbPlatformIds, entries)
      .then((entries) => {
        writeCategory({
          ...oldCategoryData,
          entries,
        });
      })
      .catch((error) => {
        setErrorDialog(
          "Fetch MetaData from igdb failed",
          "Please try again later",
        );

        error().catch((error: { response: object }) => {
          log("error", "igdb error", error.response);
        });

        // Write data anyway to add or remove games
        writeCategory({
          ...oldCategoryData,
          entries,
        });
        throw new Error();
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
  const { id } = categoryDbData;
  const oldCategoryData = readCategory(id);

  const application = getInstalledApplicationForCategory({
    applicationsPath,
    categoryDB: categoryDbData,
  });

  const entries = readEntries({
    categoryName: categoryFolderBaseName,
    applicationId: categoryDbData.application.id,
    installedApplication: application,
    oldEntries: oldCategoryData?.entries,
  });

  return {
    ...oldCategoryData,
    id,
    name: categoryFolderBaseName,
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

          categorySettledResult
            .reason()
            .catch((error: { response: object }) => {
              log("error", "igdb error all settled", error.response);
            });

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
        setErrorDialog(
          "Fetch MetaData from igdb failed",
          "Please try again later",
        );
        throw new Error();
      }
    });
  }
};
