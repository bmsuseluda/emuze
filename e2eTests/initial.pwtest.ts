import {
  type ElectronApplication,
  expect,
  type Page,
  test,
} from "@playwright/test";
import { startApp } from "./startApp";
import nodepath from "path";
import fs from "fs";
import { LibraryPage } from "./pages/libraryPage";
import { SettingsPage } from "./pages/settingsPage";

test.describe.configure({ mode: "serial" });

const configFolderPath = nodepath.join(__dirname, "emptyConfig");
const testRomsPath = nodepath.join(__dirname, "testRoms");

let app: ElectronApplication;
let page: Page;
let libraryPage: LibraryPage;
let settingsPage: SettingsPage;

test.beforeAll(async () => {
  fs.rmSync(configFolderPath, { recursive: true, force: true });
  const response = await startApp(configFolderPath);
  app = response.app;
  page = response.page;
  libraryPage = new LibraryPage(response.page);
  settingsPage = new SettingsPage(response.page);
});

test.afterAll(async () => {
  if (app) {
    await app.close();
  }
});

test("Should show initial config page", async () => {
  await settingsPage.expectIsInitialSubPage();
  await expect(settingsPage.closeButton).not.toBeVisible();
  await expect(settingsPage.generalPage.romsPath).toBeVisible();
  await expect(
    settingsPage.generalPage.romsPathRequiredError,
  ).not.toBeVisible();
  await expect(settingsPage.generalPage.emulatorsPath).not.toBeVisible();

  await expect(page).toHaveScreenshot();

  await test.step("Should prevent from closing the overlay", async () => {
    await page.keyboard.press("Escape");

    await settingsPage.expectIsInitialSubPage();
  });

  await test.step("Should prevent from submitting without roms path", async () => {
    await settingsPage.generalPage.importAllButton.click();
    await expect(settingsPage.generalPage.romsPathRequiredError).toBeVisible();
    await expect(
      settingsPage.generalPage.page.getByRole("group", { name: "Roms Path" }),
    ).toHaveScreenshot();
  });
});

test("Should import all", async () => {
  await settingsPage.generalPage.romsPath.fill(testRomsPath);
  await settingsPage.generalPage.importAllButton.click();

  await expect(settingsPage.closeButton).toBeVisible();
  await page.keyboard.press("Escape");
  await libraryPage.expectIsInitialSystem();
  await expect(page).toHaveScreenshot();

  await page.keyboard.press("ArrowDown");

  await libraryPage.expectIsSystem("Game Boy", "Super Mario Land");
});
