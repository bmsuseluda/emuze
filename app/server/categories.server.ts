import fs from "fs";
import nodepath from "path";

import type { Categories, Category as CategorySlim } from "~/types/categories";
import type { Category, Entry } from "~/types/category";
import {
  readDirectorynames,
  readFileHome,
  readFilenames,
  writeFileHome,
} from "~/server/readWriteData.server";
import { readApplications } from "~/server/applications.server";
import { convertToId } from "~/server/convertToId.server";
import { sortCaseInsensitive } from "~/server/sortCaseInsensitive.server";
import { fetchMetaData } from "~/server/igdb.server";
import { readGeneral } from "~/server/settings.server";
import type { Application } from "~/types/applications";
import type { PlatformId } from "~/types/platforms";
import { getApplicationDataById } from "~/server/applicationsDB.server";

export const paths = {
  categories: "data/categories.json",
  entries: "data/categories/",
};

export const readCategories = (): Categories => {
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
  applicationId: string
) => {
  const oldCategoryData = readCategory(categoryId);
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

      const oldEntryData = oldCategoryData?.entries?.find(
        ({ path }) => path === filename
      );
      // TODO: create metaData object with validDate
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
  // TODO: oldData is read in readEntriesWithMetaData as well
  const oldData = readCategory(category);

  if (oldData) {
    const { entryPath, igdbPlatformIds, applicationId } = oldData;
    const data: Category = {
      ...oldData,
      entries: await readEntriesWithMetaData(
        category,
        entryPath,
        igdbPlatformIds,
        applicationId
      ),
    };

    writeCategory(data);
  }
};

const createCategoryData =
  (
    { id, path, fileExtensions, flatpakId, flatpakOptionParams }: Application,
    igdbPlatformIds: number[],
    categoryFolderName: string,
    categoryFolderBasename: string,
    categoryId: PlatformId
  ) =>
  async (): Promise<Category> => {
    const entries = await readEntriesWithMetaData(
      categoryId,
      categoryFolderName,
      igdbPlatformIds,
      id
    );

    return {
      id: categoryId,
      name: categoryFolderBasename,
      applicationId: id,
      applicationPath: path,
      applicationFlatpakId: flatpakId,
      applicationFlatpakOptionParams: flatpakOptionParams,
      entryPath: categoryFolderName,
      fileExtensions,
      igdbPlatformIds,
      entries,
    };
  };

export const importCategories = async () => {
  const { categoriesPath } = readGeneral();

  if (categoriesPath) {
    const applications = readApplications();
    const categoryFolderNames = readDirectorynames(categoriesPath);
    categoryFolderNames.sort(sortCaseInsensitive);

    const getSupportedCategories = categoryFolderNames.reduce<
      Array<() => Promise<Category>>
    >((previousValue, categoryFolderName) => {
      const categoryFolderBasename = nodepath.basename(categoryFolderName);
      let igdbPlatformIds: number[] | undefined;
      let categoryId: PlatformId | undefined;
      const applicationForCategory = applications.find(({ categories }) =>
        categories.find(({ names, igdbPlatformIds: appIgdbPlatformIds, id }) =>
          names.find((value) => {
            const match =
              value.toLowerCase() === categoryFolderBasename.toLowerCase();
            if (match) {
              igdbPlatformIds = appIgdbPlatformIds;
              categoryId = id;
            }
            return match;
          })
        )
      );

      if (applicationForCategory && igdbPlatformIds && categoryId) {
        previousValue.push(
          createCategoryData(
            applicationForCategory,
            igdbPlatformIds,
            categoryFolderName,
            categoryFolderBasename,
            categoryId
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
