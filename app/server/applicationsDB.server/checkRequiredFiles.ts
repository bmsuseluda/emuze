import { existsSync } from "fs";
import nodepath from "node:path";
import type {
  Application,
  DetectedRequiredFile,
  RequiredFile,
} from "./types.js";
import { emulatorsConfigDirectory } from "../homeDirectory.server.js";
import type { ApplicationId } from "./applicationId.js";

/**
 * 1. Check if filename exists
 * 2. check if there is a file with the same filetype as the filename
 *
 * TODO: check for filetype as a fallback
 */
export const getBiosPathWithinFolder = (folder: string, biosFile: string) => {
  const biosFileFound = existsSync(nodepath.join(folder, biosFile));

  if (biosFileFound) {
    return nodepath.join(folder, biosFile);
  }

  return undefined;
};

export const getPathForRequiredFile = (
  { filename, defaultPath }: RequiredFile,
  id: ApplicationId,
  romsPathForSystem: string,
) => {
  if (defaultPath) {
    const defaultPathFull = nodepath.join(
      emulatorsConfigDirectory,
      id,
      defaultPath,
    );

    return getBiosPathWithinFolder(defaultPathFull, filename);
  }

  const biosFileInRomsPath = getBiosPathWithinFolder(
    romsPathForSystem,
    filename,
  );
  if (biosFileInRomsPath) {
    return biosFileInRomsPath;
  }

  return undefined;
};

/**
 * If a bios file is necessary, look in the following order to find it:
 * 1) defaultBiosPath
 * 2) optional emuze bios folder
 * 3) roms folder of this system
 *
 * TODO: implement emuze bios folder
 * TODO: For migration purposes it would be good to check if the emulator was configured already to use a bios.
 * This bios file could be copied or the path just used. Of couse only if the file exists.
 */
export const getBiosFiles = (
  { id, biosFiles }: Application,
  romsPathForSystem: string,
) => {
  if (biosFiles) {
    const detectedBiosFiles: DetectedRequiredFile[] = [];
    biosFiles.forEach((biosFile) => {
      const biosPath = getPathForRequiredFile(biosFile, id, romsPathForSystem);
      if (biosPath) {
        detectedBiosFiles.push({
          filePath: biosPath,
          type: biosFile.type,
        });
      }
    });

    if (detectedBiosFiles.length === 0) {
      throw new Error(`A Bios File is necessary for this System. The following are supported:
${biosFiles.map((biosFile) => `- ${biosFile}`).join("\n")}`);
    }

    return detectedBiosFiles;
  }

  return undefined;
};

export const getOtherRequiredFiles = (
  { id, otherRequiredFiles }: Application,
  romsPathForSystem: string,
) => {
  if (otherRequiredFiles) {
    const detectedFiles: DetectedRequiredFile[] = [];
    otherRequiredFiles.forEach((requiredFile) => {
      const filePath = getPathForRequiredFile(
        requiredFile,
        id,
        romsPathForSystem,
      );
      if (filePath) {
        detectedFiles.push({
          filePath: filePath,
          type: requiredFile.type,
        });
      } else {
        throw new Error(
          `The following file is necessary for this System: "${requiredFile.filename}"`,
        );
      }
    });

    return detectedFiles;
  }

  return undefined;
};
