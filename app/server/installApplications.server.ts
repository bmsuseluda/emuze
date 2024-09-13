import { categories as categoriesDB } from "./categoriesDB.server";
import { installFlatpak } from "./execute.server";
import {
  readCategories,
  readCategory,
  writeCategory,
} from "./categories.server";
import {
  checkFlatpakIsInstalled,
  updateFlatpakAppList,
} from "./applicationsDB.server/checkEmulatorIsInstalled";

export const checkFlatpakIsInstalledParallel = (flatpakId: string) =>
  new Promise<boolean>((resolve, reject) => {
    const isInstalled = checkFlatpakIsInstalled(flatpakId);
    if (isInstalled) {
      resolve(true);
    } else {
      reject(true);
    }
  });

// TODO: add tests
// TODO: check if installation can be paralleled
export const installMissingApplicationsOnLinux = async () => {
  const functions = readCategories().map(({ id }) => {
    const application = categoriesDB[id].application;
    const flatpakId = application.flatpakId;
    return checkFlatpakIsInstalledParallel(flatpakId).catch(() => {
      const isInstalled = installFlatpak(flatpakId);
      if (isInstalled) {
        const category = readCategory(id);
        category && writeCategory(category);
      }
    });
  });
  await Promise.all(functions);
  updateFlatpakAppList();
};
