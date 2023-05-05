import nodepath from "path";

import type { Application } from "~/types/jsonFiles/applications";
import {
  applications,
  getApplicationDataByName,
} from "~/server/applicationsDB.server";
import {
  readDirectorynames,
  readFilenames,
} from "~/server/readWriteData.server";
import { sortCaseInsensitive } from "~/server/sortCaseInsensitive.server";
import { isWindows } from "./operationsystem.server";
import { checkFlatpakIsInstalled } from "./execute.server";

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

export const importApplicationsOnWindows = (applicationsPath: string) => {
  const applicationFoldernames = readDirectorynames(applicationsPath);
  applicationFoldernames.sort(sortCaseInsensitive);

  const supportedApplications = applicationFoldernames.reduce<Application[]>(
    (previousValue, appFoldername) => {
      const data = getApplicationDataByName(appFoldername);
      if (data) {
        const { id } = data;

        const executable = findExecutable(appFoldername, id);
        if (executable) {
          previousValue.push({
            path: executable,
            id,
          });
        }
      }
      return previousValue;
    },
    []
  );

  return supportedApplications;
};

export const importApplicationsOnLinux = () =>
  Object.values(applications)
    .filter(({ flatpakId }) => checkFlatpakIsInstalled(flatpakId))
    .map(
      ({ id }): Application => ({
        id,
      })
    );

export const importApplications = (applicationsPath?: string) => {
  if (isWindows && applicationsPath) {
    return importApplicationsOnWindows(applicationsPath);
  } else {
    return importApplicationsOnLinux();
  }
};
