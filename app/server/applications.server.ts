import nodepath from "node:path";

import type {
  Application as ApplicationDB,
  InstalledApplicationWindows,
} from "./applicationsDB.server/types.js";
import { applications as applicationsDB } from "./applicationsDB.server/index.js";
import { readFilenames } from "./readWriteData.server.js";
import type { ApplicationId } from "./applicationsDB.server/applicationId.js";

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

const applicationPathsWindows: Partial<Record<ApplicationId, string>> = {};

const getApplicationPathWindows = (
  applicationsPath: string,
  applicationId: ApplicationId,
): string | undefined => {
  if (applicationPathsWindows[applicationId]) {
    return applicationPathsWindows[applicationId];
  }

  const path = findExecutable(applicationsPath, applicationId);
  if (path) {
    applicationPathsWindows[applicationId] = path;
  }

  return applicationPathsWindows[applicationId];
};

export const getInstalledApplicationForCategoryOnWindows = (
  applicationFromDB: ApplicationDB,
  applicationsPath: string,
): InstalledApplicationWindows | undefined => {
  const path = getApplicationPathWindows(
    applicationsPath,
    applicationFromDB.id,
  );
  if (path) {
    return { ...applicationFromDB, path };
  }

  return undefined;
};
