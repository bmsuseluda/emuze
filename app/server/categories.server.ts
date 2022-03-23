import fs from "fs";
import nodepath from "path";

import { Categories, Category as CategorySlim } from "~/types/categories";
import { Category, Entry } from "~/types/category";
import {
  readFileHome,
  readFilenames,
  readDirectorynames,
  writeFileHome,
} from "~/server/readWriteData.server";
import { readApplications } from "~/server/applications.server";
import { convertToId } from "~/server/convertToId.server";
import { sortCaseInsensitive } from "~/server/sortCaseInsensitive.server";
import { fetchCovers } from "~/server/igdb.server";
import { readGeneral } from "~/server/settings.server";
import Bottleneck from "bottleneck";
import { Application } from "~/types/applications";

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
  fs.rmSync(paths.entries, { recursive: true, force: true });
  fs.mkdirSync(paths.entries);
  writeCategories([]);
};

export const readCategory = (category: string): Category =>
  readFileHome(nodepath.join(paths.entries, `${category}.json`));

const writeCategory = (category: Category) =>
  writeFileHome(category, nodepath.join(paths.entries, `${category.id}.json`));

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

const createCategoryData =
  (
    { id, path, fileExtensions }: Application,
    platformIds: number[],
    categoryFolderName: string,
    categoryFolderBasename: string
  ) =>
  async (): Promise<Category> => {
    const entries = await readEntriesWithImages(
      categoryFolderName,
      fileExtensions,
      platformIds
    );

    return {
      id: convertToId(categoryFolderBasename),
      name: categoryFolderBasename,
      applicationId: id,
      applicationPath: path,
      entryPath: categoryFolderName,
      fileExtensions,
      platformIds,
      entries,
    };
  };

export const importCategories = async () => {
  const { categoriesPath } = readGeneral();

  if (categoriesPath) {
    const applications = readApplications();
    const categoryFolderNames = readDirectorynames(categoriesPath);
    categoryFolderNames.sort(sortCaseInsensitive);

    const limiter = new Bottleneck({
      maxConcurrent: 4,
    });

    const getSupportedCategories = categoryFolderNames.reduce<
      Array<() => Promise<Category>>
    >((previousValue, categoryFolderName) => {
      const categoryFolderBasename = nodepath.basename(categoryFolderName);
      let platformIds: number[] | undefined;
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
        previousValue.push(
          createCategoryData(
            applicationForCategory,
            platformIds,
            categoryFolderName,
            categoryFolderBasename
          )
        );
      }

      return previousValue;
    }, []);

    const supportedCategories = await Promise.all(
      getSupportedCategories.map((func) => limiter.schedule(func))
    );

    deleteCategories();

    supportedCategories.forEach((category) => {
      writeCategory(category);
    });

    writeCategories(supportedCategories);
  }
};
