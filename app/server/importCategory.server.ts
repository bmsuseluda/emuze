import type { Category as CategoryDB } from "./categoriesDB.server/types.js";
import type { Category, Entry } from "../types/jsonFiles/category.js";
import { getCategoryDataByName } from "./categoriesDB.server/index.js";
import type { SystemId } from "./categoriesDB.server/systemId.js";
import nodepath from "node:path";
import type {
  ExcludeFilesFunction,
  FindEntryNameFunction,
} from "./applicationsDB.server/types.js";
import { convertToId } from "./convertToId.server.js";
import type { ApplicationId } from "./applicationsDB.server/applicationId.js";
import { applications } from "./applicationsDB.server/index.js";
import { readGeneral } from "./settings.server.js";
import { readFilenames } from "./readWriteData.server.js";
import { fetchMetaDataFromDB } from "./igdb.server.js";
import { readCategory, writeCategory } from "./categoryDataCache.server.js";
import { sortCaseInsensitive } from "./sortCaseInsensitive.server.js";
import { log } from "./debug.server.js";
import { setImportIsRunning } from "./importIsRunning.server.js";

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
  findEntryName,
}: {
  filename: string;
  categoryPath: string;
  categoriesPath: string;
  categoryName: string;
  index: number;
  oldEntries?: Entry[];
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

// This is intentional to remove metaData
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addAsGameVersion = (lastEntry: Entry, { metaData, ...entry }: Entry) => {
  // This is intentional to remove metaData
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  oldEntries,
}: {
  categoryName: string;
  applicationId: ApplicationId;
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
    ...(await fetchMetaDataFromDB(systemId, entriesWithoutMetaData)),
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
}: CategoryImportData): Category => {
  const { id } = categoryDbData;
  const oldCategoryData = readCategory(id);

  const entries = readEntries({
    categoryName: categoryFolderBaseName,
    applicationId: categoryDbData.application.id,
    oldEntries: oldCategoryData?.entries,
  });

  return {
    ...oldCategoryData,
    id,
    name: categoryFolderBaseName,
    entries,
  };
};

export const createCategoryDataWithMetaData = async (
  category: Category,
): Promise<Category> => {
  const categoryDbData = getCategoryDataByName(category.name);
  if (category.entries && categoryDbData) {
    const entries = await readEntriesWithMetaData(
      category.id,
      category.entries,
    );
    return {
      ...category,
      entries,
    };
  }
  return Promise.resolve(category);
};

export const importCategory = async (
  categoryImportData: CategoryImportData,
) => {
  setImportIsRunning(true);
  log("debug", `importCategory start ${categoryImportData.categoryDbData.id}`);
  const startTime = new Date().getTime();
  const result = await createCategoryDataWithMetaData(
    createCategoryData(categoryImportData),
  );
  const endTime = new Date().getTime();
  log(
    "debug",
    `importCategory complete ${categoryImportData.categoryDbData.id} ${endTime - startTime}ms`,
  );

  writeCategory(result);
  setImportIsRunning(false);
};
