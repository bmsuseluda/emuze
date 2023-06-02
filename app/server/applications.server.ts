import nodepath from "path";

import type { Application } from "~/types/jsonFiles/applications";
import type { Application as ApplicationDB } from "~/server/applicationsDB.server";
import { applications as applicationsDB } from "~/server/applicationsDB.server";
import {
  readDirectorynames,
  readFilenames,
} from "~/server/readWriteData.server";
import { isWindows } from "./operationsystem.server";
import {
  checkFlatpakIsInstalled,
  checkFlatpakIsInstalledParallel,
  installFlatpak,
} from "./execute.server";
import { readCategories, readCategory } from "~/server/categories.server";
import type { Category } from "~/types/jsonFiles/category";

export const paths = {
  applications: "data/applications.json",
};

export const findExecutable = (path: string, id: string): string | null => {
  const executables = readFilenames(path, [".exe"]).filter((filename) =>
    nodepath.basename(filename).toLowerCase().includes(id)
  );

  if (executables.length > 0) {
    // TODO: What to do if there are more than one executable?
    return executables[0];
  }
  return null;
};

export const getInstalledApplicationsOnWindows = (
  applications: ApplicationDB[],
  applicationsPath: string
) => {
  const applicationFoldernames = readDirectorynames(applicationsPath);

  return applications.reduce<Application[]>((result, { id }) => {
    const appFoldername = applicationFoldernames.find((applicationFoldername) =>
      applicationFoldername.toLowerCase().includes(id.toLowerCase())
    );
    if (appFoldername) {
      const executable = findExecutable(appFoldername, id);
      if (executable) {
        result.push({
          path: executable,
          id,
        });
      }
    }
    return result;
  }, []);
};

export const getInstalledApplicationsOnLinux = (
  applications: ApplicationDB[]
) => {
  return Object.values(applications)
    .filter(({ flatpakId }) => checkFlatpakIsInstalled(flatpakId))
    .map(
      ({ id }): Application => ({
        id,
      })
    );
};

export const getInstalledApplications = (
  applications: ApplicationDB[],
  applicationsPath?: string
) => {
  if (isWindows && applicationsPath) {
    return getInstalledApplicationsOnWindows(applications, applicationsPath);
  } else {
    return getInstalledApplicationsOnLinux(applications);
  }
};

export const getInstalledApplicationForCategory = (
  applicationsForCategory: ApplicationDB[],
  defaultApplicationDB: ApplicationDB,
  oldApplication?: Application
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

  return installedApplicationsForCategory[0];
};

export const getApplicationForCategory = ({
  applicationsForCategory,
  applicationsPath,
  defaultApplicationDB,
  oldApplication,
}: {
  applicationsForCategory: ApplicationDB[];
  applicationsPath?: string;
  defaultApplicationDB: ApplicationDB;
  oldApplication?: Application;
}) => {
  const application = getInstalledApplicationForCategory(
    applicationsForCategory,
    defaultApplicationDB,
    oldApplication
  );

  return application;
};

export const installMissingApplicationsOnLinux = async () => {
  const flatpakIds = [
    ...new Set(
      readCategories()
        .map(({ id }) => readCategory(id))
        .filter((category): category is Category => !!category)
        .map((category) => applicationsDB[category.application.id].flatpakId)
    ),
  ];

  const functions = flatpakIds.map((flatpakId) =>
    checkFlatpakIsInstalledParallel(flatpakId).catch(() => {
      installFlatpak(flatpakId);
    })
  );
  await Promise.all(functions);
};
