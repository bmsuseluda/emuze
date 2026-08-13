import nodepath from "node:path";
import {
  categories as categoriesDB,
  normalizeString,
} from "./categoriesDB.server/index.js";
import { mkdirSync } from "node:fs";
import { readGeneral } from "./settings.server.js";
import { readDirectorynames } from "./readWriteData.server.js";

export const createRequiredSystemFolderStructure = (
  systemFolderPath: string,
  requiredSystemFolderStructure?: string[],
) => {
  requiredSystemFolderStructure?.forEach((requiredSystemFolder) => {
    mkdirSync(nodepath.join(systemFolderPath, requiredSystemFolder), {
      recursive: true,
    });
  });
};

export const createSystemFolders = () => {
  const generalData = readGeneral();

  if (generalData?.categoriesPath) {
    const { categoriesPath } = generalData;
    const categoryFolderNames = readDirectorynames(categoriesPath);
    Object.values(categoriesDB).forEach(({ names, getApplication }) => {
      const requiredSystemFolderStructure =
        getApplication().requiredSystemFolderStructure;

      const systemFolderFound = categoryFolderNames.find((categoryFolderName) =>
        names.find(
          (name) =>
            normalizeString(name) ===
            normalizeString(nodepath.basename(categoryFolderName)),
        ),
      );

      if (systemFolderFound) {
        createRequiredSystemFolderStructure(
          systemFolderFound,
          requiredSystemFolderStructure,
        );
      } else {
        const newSystemFolderPath = nodepath.join(categoriesPath, names[0]);
        mkdirSync(newSystemFolderPath, { recursive: true });
        createRequiredSystemFolderStructure(
          newSystemFolderPath,
          requiredSystemFolderStructure,
        );
      }
    });
  }
};
