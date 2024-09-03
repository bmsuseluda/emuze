import nodepath from "path";

import type {
  Application as ApplicationDB,
  InstalledApplicationWindows,
} from "./applicationsDB.server/types";
import { applications as applicationsDB } from "./applicationsDB.server";
import type { Category as CategoryDB } from "./categoriesDB.server/types";
import { readFilenames } from "./readWriteData.server";
import { isWindows } from "./operationsystem.server";
import type { ApplicationId } from "./applicationsDB.server/applicationId";
import { checkFlatpakIsInstalled } from "./applicationsDB.server/checkEmulatorIsInstalled";

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
  applicationFromDB: ApplicationDB,
) => {
  if (checkFlatpakIsInstalled(applicationFromDB.flatpakId)) {
    return applicationFromDB;
  }

  return undefined;
};

export const getInstalledApplicationForCategoryOnWindows = (
  applicationFromDB: ApplicationDB,
  applicationsPath: string,
): InstalledApplicationWindows | undefined => {
  const path = findExecutable(applicationsPath, applicationFromDB.id);
  if (path) {
    return { ...applicationFromDB, path };
  }

  return undefined;
};

export const getInstalledApplicationForCategory = ({
  applicationsPath,
  categoryDB,
}: {
  applicationsPath?: string;
  categoryDB: CategoryDB;
}) => {
  if (isWindows() && applicationsPath) {
    return getInstalledApplicationForCategoryOnWindows(
      categoryDB.application,
      applicationsPath,
    );
  }

  return getInstalledApplicationForCategoryOnLinux(categoryDB.application);
};
