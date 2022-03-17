import nodepath from "path";

import { Application, Applications } from "~/types/applications";
import { getApplicationData } from "~/server/applicationsDB.server";
import {
  readDirectorynames,
  readFile,
  readFilenames,
  writeFile,
} from "~/server/readWriteData.server";
import { convertToId } from "~/server/convertToId.server";
import { sortCaseInsensitive } from "~/server/sortCaseInsensitive.server";
import { readGeneral } from "~/server/settings.server";

export const paths = {
  applications: "data/applications.json",
};

export const readApplication = (application: string) => {
  const applications = readApplications();
  return applications.find(({ id }) => id === application);
};

export const readApplications = (): Applications =>
  readFile(paths.applications);

export const writeApplications = (applications: Applications) =>
  writeFile(applications, paths.applications);

export const writeApplication = (application: Application) => {
  const oldApplications = readApplications();
  const newApplications = [
    ...oldApplications.filter((value) => value.id !== application.id),
    application,
  ];
  writeFile(newApplications, paths.applications);
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

export const importApplications = () => {
  const { applicationsPath } = readGeneral();

  if (applicationsPath) {
    const applicationFoldernames = readDirectorynames(applicationsPath);
    applicationFoldernames.sort(sortCaseInsensitive);

    const supportedApplications = applicationFoldernames.reduce<Applications>(
      (previousValue, appFoldername) => {
        const data = getApplicationData(appFoldername);
        if (data) {
          const { categories, fileExtensions, name, id } = data;

          const executable = findExecutable(appFoldername, id);
          if (executable) {
            previousValue.push({
              categories,
              path: executable,
              fileExtensions,
              id: convertToId(nodepath.basename(appFoldername)),
              name,
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
