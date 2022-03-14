import fs from "fs";
import nodepath from "path";

import { Categories, Category as CategorySlim } from "~/types/categories";
import { Category, Entry } from "~/types/category";
import {
  readFile,
  readFilenames,
  readDirectorynames,
  writeFile,
} from "~/server/readWriteData.server";
import { readApplications } from "~/server/applications.server";
import { convertToId } from "./convertToId.server";
import { sortCaseInsensitive } from "./sortCaseInsensitive.server";
import { fetchCovers } from "./igdb.server";
import { readGeneral } from "./settings.server";

export const paths = {
  categories: "data/categories.json",
  entries: "data/categories/",
};

export const readCategories = (): Categories => {
  const categories = readFile(paths.categories);

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
  writeFile(categoriesSlim, paths.categories);
};

const deleteCategories = () => {
  fs.rmSync(paths.entries, { recursive: true, force: true });
  fs.mkdirSync(paths.entries);
  writeCategories([]);
};

export const readCategory = (category: string): Category =>
  readFile(nodepath.join(paths.entries, `${category}.json`));

const writeCategory = (category: Category) =>
  writeFile(category, nodepath.join(paths.entries, `${category.id}.json`));

export const sortFileNames = (a: string, b: string) => {
  const aWithoutPath = nodepath.basename(a);
  const bWithoutPath = nodepath.basename(b);
  const aExtname = nodepath.extname(aWithoutPath);
  const bExtname = nodepath.extname(bWithoutPath);
  const aWithoutFileExtension = aWithoutPath.split(aExtname)[0];
  const bWithoutExtension = bWithoutPath.split(bExtname)[0];
  return sortCaseInsensitive(aWithoutFileExtension, bWithoutExtension);
};

const readEntriesWithImages = async (
  entryPath: string,
  fileExtensions: string[],
  platformIds: number[]
) => {
  const filenames = readFilenames(entryPath, fileExtensions);
  filenames.sort(sortFileNames);
  const entries = filenames.map<Entry>((filename) => {
    const extension = nodepath.extname(filename);
    const [name] = nodepath.basename(filename).split(extension);
    return {
      id: convertToId(name),
      name,
      path: filename,
    };
  });

  const entriesWithImages = await fetchCovers(platformIds, entries);

  return entriesWithImages;
};

export const importEntries = async (category: string) => {
  const oldData = readCategory(category);
  const { entryPath, fileExtensions, platformIds } = oldData;
  const data: Category = {
    ...oldData,
    entries: await readEntriesWithImages(
      entryPath,
      fileExtensions,
      platformIds
    ),
  };

  writeCategory(data);
};

export const importCategories = async () => {
  const { categoriesPath } = readGeneral();

  if (categoriesPath) {
    const applications = readApplications();
    const categoryFolderNames = readDirectorynames(categoriesPath);
    categoryFolderNames.sort(sortCaseInsensitive);

    const supportedCategories = await categoryFolderNames.reduce<
      Promise<Category[]>
    >(async (previousValue, categoryFolderName) => {
      await previousValue;
      const categoryFolderBasename = nodepath.basename(categoryFolderName);
      let platformIds;
      const applicationForCategory = applications.find(({ categories }) =>
        categories.find(({ names, platformIds: appPlatformIds }) =>
          names.find((value) => {
            const match =
              value.toLowerCase() === categoryFolderBasename.toLowerCase();
            if (match) {
              platformIds = appPlatformIds;
            }
            return match;
          })
        )
      );

      if (applicationForCategory && platformIds) {
        const { id, path, fileExtensions } = applicationForCategory;
        const entries = await readEntriesWithImages(
          categoryFolderName,
          fileExtensions,
          platformIds
        );

        (await previousValue).push({
          id: convertToId(categoryFolderBasename),
          name: categoryFolderBasename,
          applicationId: id,
          applicationPath: path,
          entryPath: categoryFolderName,
          fileExtensions,
          platformIds,
          entries,
        });
      }

      return previousValue;
    }, Promise.resolve([]));

    deleteCategories();

    supportedCategories.forEach((category) => {
      writeCategory(category);
    });

    writeCategories(supportedCategories);
  }
};
