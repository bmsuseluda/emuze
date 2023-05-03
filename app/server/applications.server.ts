import nodepath from "path";

import type { Application } from "~/types/jsonFiles/applications";
import {
  applications,
  getApplicationDataByName,
} from "~/server/applicationsDB.server";
import {
  readDirectorynames,
  readFileHome,
  readFilenames,
  writeFileHome,
} from "~/server/readWriteData.server";
import { sortCaseInsensitive } from "~/server/sortCaseInsensitive.server";
import { readGeneral } from "~/server/settings.server";
import { isWindows } from "./operationsystem.server";
import { checkFlatpakIsInstalled } from "./execute.server";

export const paths = {
  applications: "data/applications.json",
};

export const readApplications = (): Application[] =>
  readFileHome(paths.applications);

export const writeApplications = (applications: Application[]) =>
  writeFileHome(applications, paths.applications);

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

export const importApplicationsOnWindows = () => {
  const { applicationsPath } = readGeneral();

  if (applicationsPath) {
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

    writeApplications(supportedApplications);
  }
};

export const importApplicationsOnLinux = () => {
  const supportedApplications = Object.values(applications).reduce<
    Application[]
  >((previousValue, application) => {
    if (
      !!application.flatpakId &&
      checkFlatpakIsInstalled(application.flatpakId)
    ) {
      const { id } = application;
      previousValue.push({
        id,
      });
    }

    return previousValue;
  }, []);

  writeApplications(supportedApplications);
};

export const importApplications = () => {
  if (isWindows) {
    importApplicationsOnWindows();
  } else {
    importApplicationsOnLinux();
  }
};
