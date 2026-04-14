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

/**
 * If a bios file is necessary, look in the emuze bios folder.
 * Check for bios files in the following order:
 * 1) name
 * 2) file type and hash
 */
export const getRequiredFiles = ({
  requiredFiles,
  biosPath,
  allRequired = false,
}: {
  requiredFiles?: RequiredFiles[];
  systemFolderName: string;
  biosPath?: string;
  allRequired?: boolean;
}) => {
  if (requiredFiles) {
    if (!biosPath || biosPath.trim().length < 3) {
      throw new Error(
        `A BIOS File is necessary for this System. Please set a "BIOS Path" in the general settings.`,
      );
    }
    const detectedRequiredFiles: DetectedRequiredFile[] = [];

    if (existsSync(biosPath)) {
      const foundFilenames = readFilenames({
        path: biosPath,
        fileExtensions: requiredFiles.flatMap(({ requiredFiles }) =>
          requiredFiles.map(({ filename }) => nodepath.extname(filename)),
        ),
      });

      requiredFiles.forEach(({ type, requiredFiles }) => {
        let foundFileForType: string | null = null;
        for (const requiredFile of requiredFiles) {
          const foundFilename = foundFilenames.find(
            findFilenameOrHash(requiredFile),
          );
          if (foundFilename) {
            foundFileForType = foundFilename;
            break;
          }
        }

        if (foundFileForType) {
          detectedRequiredFiles.push({
            type,
            filePath: foundFileForType,
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
      throw new Error(`A BIOS File is necessary for this System. The following are supported:
${requiredFiles.flatMap(({ requiredFiles }) => requiredFiles.map(({ filename }) => `- ${filename}`)).join("\n")}

Please put your BIOS File under "${biosPath}"`);
    }

    return detectedRequiredFiles;
  }

  return undefined;
};
