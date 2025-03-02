import workerpool from "workerpool";

import type { Category as CategoryDB } from "../app/server/categoriesDB.server/types";
import type { Category, Entry } from "../app/types/jsonFiles/category";
import { getCategoryDataByName } from "../app/server/categoriesDB.server";
import { getInstalledApplicationForCategory } from "../app/server/applications.server";
import type { SystemId } from "../app/server/categoriesDB.server/systemId";
import nodepath from "path";
import type {
  ExcludeFilesFunction,
  FindEntryNameFunction,
  InstalledApplication,
} from "../app/server/applicationsDB.server/types";
import { convertToId } from "../app/server/convertToId.server";
import type { ApplicationId } from "../app/server/applicationsDB.server/applicationId";
import { applications } from "../app/server/applicationsDB.server";
import { readGeneral } from "../app/server/settings.server";
import { readFilenames } from "../app/server/readWriteData.server";
import { fetchMetaDataFromDB } from "../app/server/igdb.server";
import { readCategory } from "../app/server/categoryDataCache.server";
import { sortCaseInsensitive } from "../app/server/sortCaseInsensitive.server";
import { log } from "../app/server/debug.server";

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

export const readEntriesWithMetaData = (
  systemId: SystemId,
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
    ...fetchMetaDataFromDB(systemId, entriesWithoutMetaData),
  ].sort(sortEntries);
};

export interface CategoryImportData {
  categoryDbData: CategoryDB;
  categoryFolderBaseName: string;
  applicationsPath?: string;
}

export const createCategoryData = ({
  categoryDbData,
  categoryFolderBaseName,
  applicationsPath,
}: CategoryImportData): Category => {
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

export const createCategoryDataWithMetaData = (
  category: Category,
): Category => {
  const categoryDbData = getCategoryDataByName(category.name);
  if (category.entries && categoryDbData) {
    const entries = readEntriesWithMetaData(category.id, category.entries);
    return {
      ...category,
      entries,
    };
  }
  return category;
};

export const importCategory = (categoryImportData: CategoryImportData) => {
  log("debug", "importCategory start", categoryImportData.categoryDbData.id);
  const timeName = `importCategory ${categoryImportData.categoryDbData.id}`;
  console.time(timeName);
  const result = createCategoryDataWithMetaData(
    createCategoryData(categoryImportData),
  );
  log("debug", "importCategory complete", categoryImportData.categoryDbData.id);
  console.timeLog(timeName);
  console.timeEnd(timeName);
  return result;
};

workerpool.worker({
  importCategory,
});
