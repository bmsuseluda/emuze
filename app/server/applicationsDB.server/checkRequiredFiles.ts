import nodepath from "node:path";
import type { Application, DetectedRequiredFile } from "./types.js";
import { readFilenames } from "../readWriteData.server.js";
import { existsSync } from "node:fs";

/*
 * TODO: For migration purposes it would be good to check if the emulator was configured already to use a bios.
 * This bios file could be copied or the path just used. Of couse only if the file exists.
 */

/**
 * If a bios file is necessary, look in the emuze bios folder.
 * Check for bios files in the following order:
 * 1) name
 * 2) file type and hash
 */
export const getBiosFiles = (
  { biosFiles }: Application,
  systemFolderName: string,
  biosPath?: string,
) => {
  if (biosFiles) {
    if (!biosPath) {
      throw new Error(
        `A Bios File is necessary for this System. Please set a "Bios Path" in the general settings.`,
      );
    }
    const systemBiosPath = nodepath.join(biosPath, systemFolderName);
    const detectedBiosFiles: DetectedRequiredFile[] = [];

    if (existsSync(systemBiosPath)) {
      const foundBiosFilenames = readFilenames({
        path: systemBiosPath,
        // TODO: are there several fileExtensions?
        fileExtensions: [
          nodepath.extname(biosFiles.at(0)!.requiredFiles.at(0)!.filename),
        ],
      });

      biosFiles.forEach(({ type, requiredFiles }) => {
        const biosFileForType = requiredFiles.find(
          (requiredFile) =>
            !!foundBiosFilenames.find((foundFileName) =>
              foundFileName.endsWith(requiredFile.filename),
            ),
        );

        if (biosFileForType) {
          detectedBiosFiles.push({
            type,
            filePath: nodepath.join(systemBiosPath, biosFileForType.filename),
          });
        } else {
          // TODO: check hash
        }
      });
    }

    if (detectedBiosFiles.length === 0) {
      throw new Error(`A Bios File is necessary for this System. The following are supported:
${biosFiles.flatMap(({ requiredFiles }) => requiredFiles.map(({ filename }) => `- ${filename}`)).join("\n")}

Please put your Bios File under "${systemBiosPath}"`);
    }

    return detectedBiosFiles;
  }

  return undefined;
};

/**
 * If there are other required files, look in the emuze bios folder.
 * Check for other required files in the following order:
 * 1) name
 * 2) file type and hash
 *
 * TODO: How to use the getBiosFiles function here?
 */
export const getOtherRequiredFiles = (
  { otherRequiredFiles }: Application,
  systemFolderName: string,
  biosPath?: string,
) => {
  if (otherRequiredFiles) {
    if (!biosPath) {
      throw new Error(
        `A Bios File is necessary for this System. Please set a "Bios Path" in the general settings`,
      );
    }
    const detectedBiosFiles: DetectedRequiredFile[] = [];

    const systemBiosPath = nodepath.join(biosPath, systemFolderName);
    const foundBiosFilenames = readFilenames({
      path: systemBiosPath,
      fileExtensions: otherRequiredFiles.flatMap(({ requiredFiles }) =>
        requiredFiles.map(({ filename }) => nodepath.extname(filename)),
      ),
    });

    otherRequiredFiles.forEach(({ type, requiredFiles }) => {
      const fileForType = requiredFiles.find(
        (requiredFile) =>
          !!foundBiosFilenames.find((foundFileName) =>
            foundFileName.endsWith(requiredFile.filename),
          ),
      );

      if (fileForType) {
        detectedBiosFiles.push({
          type,
          filePath: nodepath.join(systemBiosPath, fileForType.filename),
        });
      } else {
        // TODO: check hash
        throw new Error(`A ${type} File is necessary for this System. The following are supported:
${requiredFiles.map(({ filename }) => `- ${filename}`).join("\n")}`);
      }
    });

    return detectedBiosFiles;
  }

  return undefined;
};
