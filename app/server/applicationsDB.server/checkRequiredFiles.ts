import nodepath from "node:path";
import crypto from "node:crypto";
import type {
  DetectedRequiredFile,
  RequiredFile,
  RequiredFiles,
} from "./types.js";
import { readFilenames } from "../readWriteData.server.js";
import { existsSync, readFileSync } from "node:fs";

const createHash = (filepath: string) =>
  crypto.createHash("sha512").update(readFileSync(filepath)).digest("hex");

const findFilenameOrHash =
  ({ filename, hash }: RequiredFile) =>
  (foundFilePath: string) =>
    foundFilePath.endsWith(filename) ||
    (hash && hash === createHash(foundFilePath));

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
export const getRequiredFiles = ({
  requiredFiles,
  systemFolderName,
  biosPath,
  allRequired = false,
}: {
  requiredFiles?: RequiredFiles[];
  systemFolderName: string;
  biosPath?: string;
  allRequired?: boolean;
}) => {
  if (requiredFiles) {
    if (!biosPath) {
      throw new Error(
        `A Bios File is necessary for this System. Please set a "Bios Path" in the general settings.`,
      );
    }
    // TODO: Are the subfolders per system necessary?
    const systemBiosPath = nodepath.join(biosPath, systemFolderName);
    const detectedRequiredFiles: DetectedRequiredFile[] = [];

    if (existsSync(systemBiosPath)) {
      const foundFilenames = readFilenames({
        path: systemBiosPath,
        fileExtensions: requiredFiles.flatMap(({ requiredFiles }) =>
          requiredFiles.map(({ filename }) => nodepath.extname(filename)),
        ),
      });

      requiredFiles.forEach(({ type, requiredFiles }) => {
        const foundFileForType = requiredFiles.find(
          (requiredFile) =>
            !!foundFilenames.find(findFilenameOrHash(requiredFile)),
        );

        if (foundFileForType) {
          detectedRequiredFiles.push({
            type,
            filePath: nodepath.join(systemBiosPath, foundFileForType.filename),
          });
        } else {
          if (allRequired) {
            throw new Error(`A ${type} File is necessary for this System. The following are supported:
              ${requiredFiles.map(({ filename }) => `- ${filename}`).join("\n")}`);
          }
        }
      });
    }

    if (detectedRequiredFiles.length === 0) {
      throw new Error(`A Bios File is necessary for this System. The following are supported:
${requiredFiles.flatMap(({ requiredFiles }) => requiredFiles.map(({ filename }) => `- ${filename}`)).join("\n")}

Please put your Bios File under "${systemBiosPath}"`);
    }

    return detectedRequiredFiles;
  }

  return undefined;
};
