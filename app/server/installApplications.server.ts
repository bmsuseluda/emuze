import { categories as categoriesDB } from "./categoriesDB.server";
import { installFlatpak } from "./execute.server";
import {
  readCategories,
  readCategory,
  writeCategory,
} from "./categories.server";
import type { Category } from "../types/jsonFiles/category";
import { execFile } from "child_process";

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
  const categoriesWithoutApplication = [
    ...new Set(
      readCategories()
        .map(({ id }) => readCategory(id))
        .filter(
          (category): category is Category =>
            !!category && !category?.application,
        ),
    ),
  ];

  const functions = categoriesWithoutApplication.map((category) => {
    const defaultApplication = categoriesDB[category.id].defaultApplication;
    const flatpakId = defaultApplication.flatpakId;
    return checkFlatpakIsInstalledParallel(flatpakId).catch(() => {
      const isInstalled = installFlatpak(flatpakId);
      if (isInstalled) {
        writeCategory({
          ...category,
          application: defaultApplication,
        });
      }
    });
  });
  await Promise.all(functions);
};
