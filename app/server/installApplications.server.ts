import { categories as categoriesDB } from "./categoriesDB.server";
import { installFlatpak } from "./execute.server";
import { readCategories } from "./categories.server";
import {
  checkFlatpakIsInstalled,
  updateFlatpakAppList,
} from "./applicationsDB.server/checkEmulatorIsInstalled";
import { readCategory, writeCategory } from "./categoryDataCache.server";

export const checkFlatpakIsInstalledParallel = (flatpakId: string) =>
  new Promise<boolean>((resolve, reject) => {
    const isInstalled = checkFlatpakIsInstalled(flatpakId);
    if (isInstalled) {
      resolve(true);
    } else {
      reject(true);
    }
  });

export const installMissingApplicationsOnLinux = async () => {
  const functions = readCategories().map(({ id }) => {
    const application = categoriesDB[id].application;
    const flatpakId = application.flatpakId;
    if (!application.bundledPathLinux) {
      return checkFlatpakIsInstalledParallel(flatpakId).catch(() => {
        const isInstalled = installFlatpak(flatpakId);
        if (isInstalled) {
          const category = readCategory(id);
          category && writeCategory(category);
        }
      });
    }
    return Promise.resolve(true);
  });
  await Promise.all(functions);
  updateFlatpakAppList();
};
