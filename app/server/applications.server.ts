import nodepath from "path";

import type {
  Application,
  ApplicationWindows,
} from "~/types/jsonFiles/applications";
import { isApplicationWindows } from "~/types/jsonFiles/applications";
import type { Application as ApplicationDB } from "~/server/applicationsDB.server";
import { applications as applicationsDB } from "~/server/applicationsDB.server";
import { categories as categoriesDB } from "~/server/categoriesDB.server";
import { readFilenames } from "~/server/readWriteData.server";
import { isWindows } from "./operationsystem.server";
import {
  checkFlatpakIsInstalled,
  checkFlatpakIsInstalledParallel,
  installFlatpak,
} from "./execute.server";
import {
  readCategories,
  readCategory,
  writeCategory,
} from "~/server/categories.server";
import type { Category } from "~/types/jsonFiles/category";

export const paths = {
  applications: "data/applications.json",
};

export const findExecutable = (path: string, id: string): string | null => {
  const executables = readFilenames({ path, fileExtensions: [".exe"] }).filter(
    (filename) => nodepath.basename(filename).toLowerCase().includes(id),
  );

  if (executables.length > 0) {
    // TODO: What to do if there are more than one executable?
    return executables[0];
  }
  return null;
};

export const getInstalledApplicationForCategoryOnLinux = (
  defaultApplicationDB: ApplicationDB,
  oldApplication?: Application,
) => {
  if (
    oldApplication &&
    checkFlatpakIsInstalled(applicationsDB[oldApplication.id].flatpakId)
  ) {
    return oldApplication;
  }

  if (checkFlatpakIsInstalled(defaultApplicationDB.flatpakId)) {
    return defaultApplicationDB;
  }

  return undefined;
};

export const getInstalledApplicationForCategoryOnWindows = (
  defaultApplicationDB: ApplicationDB,
  applicationsPath: string,
  oldApplication?: Application,
): ApplicationWindows | undefined => {
  if (
    oldApplication &&
    isApplicationWindows(oldApplication) &&
    findExecutable(applicationsPath, oldApplication.id)
  ) {
    return oldApplication;
  }

  const executableDefaultApplication = findExecutable(
    applicationsPath,
    defaultApplicationDB.id,
  );
  if (executableDefaultApplication) {
    return { ...defaultApplicationDB, path: executableDefaultApplication };
  }

  return undefined;
};

export const getInstalledApplicationForCategory = ({
  applicationsPath,
  defaultApplicationDB,
  oldApplication,
}: {
  applicationsPath?: string;
  defaultApplicationDB: ApplicationDB;
  oldApplication?: Application;
}) => {
  if (isWindows && applicationsPath) {
    return getInstalledApplicationForCategoryOnWindows(
      defaultApplicationDB,
      applicationsPath,
      oldApplication,
    );
  }

  return getInstalledApplicationForCategoryOnLinux(
    defaultApplicationDB,
    oldApplication,
  );
};

export const installMissingApplicationsOnLinux = async () => {
  const categoriesWithoutApplication = [
    ...new Set(
      readCategories()
        .map(({ id }) => readCategory(id))
        .filter(
          (category): category is Category =>
            !!category && !category?.application,
        ),
    ),
  ];

  const functions = categoriesWithoutApplication.map((category) => {
    const defaultApplication = categoriesDB[category.id].defaultApplication;
    const flatpakId = defaultApplication.flatpakId;
    return checkFlatpakIsInstalledParallel(flatpakId).catch(() => {
      installFlatpak(flatpakId);
      writeCategory({
        ...category,
        application: defaultApplication,
      });
    });
  });
  await Promise.all(functions);
};
