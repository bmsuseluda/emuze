import nodepath from "path";

import type {
  Application,
  ApplicationWindows,
} from "../types/jsonFiles/applications";
import { isApplicationWindows } from "../types/jsonFiles/applications";
import type { Application as ApplicationDB } from "./applicationsDB.server/types";
import { applications as applicationsDB } from "./applicationsDB.server";
import type { Category as CategoryDB } from "./categoriesDB.server/types";
import { readFilenames } from "./readWriteData.server";
import { isWindows } from "./operationsystem.server";
import type { ApplicationId } from "./applicationsDB.server/applicationId";
import { checkFlatpakIsInstalled } from "./applicationsDB.server/checkFlatpakInstalled";

export const paths = {
  applications: "data/applications.json",
};

export const findExecutable = (
  path: string,
  id: ApplicationId,
): string | null => {
  const configuredExecutable = applicationsDB[id].executable;
  const executables = readFilenames({ path, fileExtensions: [".exe"] }).filter(
    (filename) => {
      const basename = nodepath.basename(filename).toLowerCase();
      return (
        basename === configuredExecutable?.toLowerCase() ||
        basename.includes(id)
      );
    },
  );

  if (executables.length > 0) {
    // TODO: What to do if there are more than one executable?
    return executables[0];
  }
  return null;
};

export const getInstalledApplicationForCategoryOnLinux = (
  applicationsDbPrioritized: ApplicationDB[],
  oldApplication?: Application,
) => {
  if (
    oldApplication &&
    checkFlatpakIsInstalled(applicationsDB[oldApplication.id].flatpakId)
  ) {
    return oldApplication;
  }

  return applicationsDbPrioritized.find((application) =>
    checkFlatpakIsInstalled(application.flatpakId),
  );
};

export const getInstalledApplicationForCategoryOnWindows = (
  applicationsDbPrioritized: ApplicationDB[],
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

  let executableApplication = undefined;

  applicationsDbPrioritized.find((application) => {
    const path = findExecutable(applicationsPath, application.id);
    if (path) {
      executableApplication = { ...application, path };
    }
    return !!path;
  });

  return executableApplication;
};

export const getInstalledApplicationForCategory = ({
  applicationsPath,
  categoryDB,
  oldApplication,
}: {
  applicationsPath?: string;
  categoryDB: CategoryDB;
  oldApplication?: Application;
}) => {
  const applicationsFromDbPrioritized = [
    categoryDB.defaultApplication,
    ...categoryDB.applications.filter(
      ({ id }) =>
        id !== categoryDB.defaultApplication.id && id !== oldApplication?.id,
    ),
  ];

  if (isWindows() && applicationsPath) {
    return getInstalledApplicationForCategoryOnWindows(
      applicationsFromDbPrioritized,
      applicationsPath,
      oldApplication,
    );
  }

  return getInstalledApplicationForCategoryOnLinux(
    applicationsFromDbPrioritized,
    oldApplication,
  );
};
