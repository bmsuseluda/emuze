import type { ExcludeFilesFunction } from "../../types.js";
import { versionNumberRegExp } from "./types.js";

/**
 * Excludes
 * - Updates
 * - DLCs
 * - digital files if physical files exist
 */
export const excludeFiles: ExcludeFilesFunction = (filePaths) =>
  filePaths.filter(
    (filePath) =>
      filePath.includes("[UPD]") ||
      filePath.includes("[DLC]") ||
      (filePath.includes("[BASE]") &&
        !!filePaths.find(
          (otheFilePath) =>
            otheFilePath.startsWith(
              filePath.split("[")[0].replace(versionNumberRegExp, "").trim(),
            ) && otheFilePath.endsWith(".xci"),
        )),
  );
