import nodepath from "node:path";
import crypto from "node:crypto";
import type {
  DetectedRequiredFile,
  RequiredFile,
  RequiredFiles,
} from "./types.js";
import { readFilenames } from "../readWriteData.server.js";
import { existsSync, readFileSync } from "node:fs";
import { biosOpenSourceHomeDirectory } from "../homeDirectory.server.js";

const createHash = (filepath: string) =>
  crypto.createHash("sha512").update(readFileSync(filepath)).digest("hex");

const findFilenameOrHash =
  ({ filename, hash }: RequiredFile) =>
  (foundFilePath: string) =>
    foundFilePath.toLowerCase().endsWith(filename.toLowerCase()) ||
    (hash && hash === createHash(foundFilePath));

const removeDuplicateFilenames = (requiredFiles: RequiredFile[]): string[] => [
  ...new Set(requiredFiles.map(({ filename }) => filename)),
];

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
  bundledBiosOpenSource = false,
}: {
  requiredFiles?: RequiredFiles[];
  systemFolderName: string;
  biosPath?: string;
  allRequired?: boolean;
  bundledBiosOpenSource?: boolean;
}) => {
  if (requiredFiles) {
    if (!bundledBiosOpenSource && (!biosPath || biosPath.trim().length < 3)) {
      throw new Error(
        `A BIOS File is necessary for this System. Please set a "BIOS Path" in the general settings.`,
      );
    }
    const detectedRequiredFiles: DetectedRequiredFile[] = [];

    const foundFilenames: string[] = [];
    const fileExtensions = requiredFiles.flatMap(({ requiredFiles }) =>
      requiredFiles.map(({ filename }) => nodepath.extname(filename)),
    );

    if (biosPath && existsSync(biosPath)) {
      foundFilenames.push(
        ...readFilenames({
          path: biosPath,
          fileExtensions,
        }),
      );
    }

    if (bundledBiosOpenSource && existsSync(biosOpenSourceHomeDirectory)) {
      foundFilenames.push(
        ...readFilenames({
          path: biosOpenSourceHomeDirectory,
          fileExtensions,
        }),
      );
    }

    if (foundFilenames.length > 0) {
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
${requiredFiles.flatMap(({ requiredFiles }) => removeDuplicateFilenames(requiredFiles).map((filename) => `- ${filename}`)).join("\n")}

Please put your BIOS File under "${biosPath}"`);
    }

    return detectedRequiredFiles;
  }

  return undefined;
};
