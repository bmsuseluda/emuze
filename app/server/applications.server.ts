import nodepath from "path";

import type { Application } from "~/types/jsonFiles/applications";
import type { Application as ApplicationDB } from "~/server/applicationsDB.server";
import {
  readDirectorynames,
  readFilenames,
} from "~/server/readWriteData.server";
import { isWindows } from "./operationsystem.server";
import { checkFlatpakIsInstalled, installFlatpak } from "./execute.server";
import { readCategories } from "~/server/categories.server";
import { categories as categoriesDB } from "~/server/categoriesDB.server";

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
) =>
  Object.values(applications)
    .filter(({ flatpakId }) => checkFlatpakIsInstalled(flatpakId))
    .map(
      ({ id }): Application => ({
        id,
      })
    );

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
  installedApplicationsForCategory: Application[],
  defaultApplicationDB: ApplicationDB,
  oldApplication?: Application
) => {
  if (installedApplicationsForCategory.length > 0) {
    if (
      oldApplication &&
      installedApplicationsForCategory.find(
        ({ id }) => id === oldApplication?.id
      )
    ) {
      return oldApplication;
    }

    const defaultApplication = installedApplicationsForCategory.find(
      ({ id }) => id === defaultApplicationDB.id
    );
    if (defaultApplication) {
      return defaultApplication;
    }

    return installedApplicationsForCategory[0];
  }

  return {
    id: defaultApplicationDB.id,
  };
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
  const installedApplications = getInstalledApplications(
    applicationsForCategory,
    applicationsPath
  );
  const application = getInstalledApplicationForCategory(
    installedApplications,
    defaultApplicationDB,
    oldApplication
  );

  return application;
};

export const installMissingApplicationsOnLinux = () => {
  const categories = readCategories();
  categories.forEach(({ id }) => {
    const flatpakId = categoriesDB[id].defaultApplication.flatpakId;
    if (!checkFlatpakIsInstalled(flatpakId)) {
      installFlatpak(flatpakId);
    }
  });
};

export const checkHasMissingApplications = () => {
  const categories = readCategories();
  return !!categories.find(({ id }) => {
    const flatpakId = categoriesDB[id].defaultApplication.flatpakId;
    return !checkFlatpakIsInstalled(flatpakId);
  });
};
