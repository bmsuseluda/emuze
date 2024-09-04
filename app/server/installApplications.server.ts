import { categories as categoriesDB } from "./categoriesDB.server";
import { installFlatpak } from "./execute.server";
import {
  readCategories,
  readCategory,
  writeCategory,
} from "./categories.server";
import { execFile } from "child_process";

// TODO: Check if error message from flatpak info could be removed or maybe flatpak info is not the best way
export const checkFlatpakIsInstalledParallel = (flatpakId: string) =>
  new Promise<boolean>((resolve, reject) => {
    execFile("flatpak", ["info", flatpakId], (error, stdout) => {
      if (error) {
        reject(true);
      }
      if (stdout) {
        resolve(true);
      }
    });
  });

// TODO: add tests
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
};
