import { test as base } from "@playwright/test";
import { LibraryPage } from "./libraryPage.js";
import { SettingsPage } from "./settingsPage.js";

type MyFixtures = {
  libraryPage: LibraryPage;
  settingsPage: SettingsPage;
};

export const test = base.extend<MyFixtures>({
  libraryPage: async ({ page }, use) => {
    await use(new LibraryPage(page));
  },

  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
});
export { expect } from "@playwright/test";
