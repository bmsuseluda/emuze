import nodepath from "node:path";

import type { ConfigFile } from "./applicationsDB.server/types.js";
import { copy } from "./readWriteData.server.js";
import { emulatorsConfigDirectory } from "./homeDirectory.server.js";
import type { ApplicationId } from "./applicationsDB.server/applicationId.js";
import { existsSync } from "node:fs";
import { log } from "./debug.server.js";

const getEmuzeFolder = (
  applicationId: ApplicationId,
  filePathRelative: string,
) => nodepath.join(emulatorsConfigDirectory, applicationId, filePathRelative);

const getEmulatorFolder = (basePath: string, filePathRelative: string) =>
  nodepath.join(basePath, filePathRelative);

export const createEmuzeFolderIfNotExist = (
  applicationId: ApplicationId,
  configFile?: ConfigFile,
) => {
  if (
    configFile &&
    !existsSync(nodepath.join(emulatorsConfigDirectory, applicationId))
  ) {
    syncFromEmulatorFolderToEmuzeFolder(applicationId, configFile);
  }
};

export const syncFromEmuzeFolderToEmulatorFolder = (
  applicationId: ApplicationId,
  configFile?: ConfigFile,
) => {
  if (configFile) {
    configFile.files.forEach((filePathRelative) => {
      const source = getEmuzeFolder(applicationId, filePathRelative);
      const destination = getEmulatorFolder(
        configFile.basePath,
        filePathRelative,
      );

      log(
        "debug",
        "syncFromEmuzeFolderToEmulatorFolder",
        applicationId,
        source,
        destination,
      );

      copy(source, destination);
    });
  }
};

export const syncFromEmulatorFolderToEmuzeFolder = (
  applicationId: ApplicationId,
  configFile?: ConfigFile,
) => {
  if (configFile) {
    configFile.files.forEach((filePathRelative) => {
      const source = getEmulatorFolder(configFile.basePath, filePathRelative);
      const destination = getEmuzeFolder(applicationId, filePathRelative);

      log(
        "debug",
        "syncFromEmulatorFolderToEmuzeFolder",
        applicationId,
        source,
        destination,
      );

      copy(source, destination);
    });
  }
};
