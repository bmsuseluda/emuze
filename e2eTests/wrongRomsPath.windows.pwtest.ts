import {
  type ElectronApplication,
  expect,
  type Page,
  test,
} from "@playwright/test";
import { startApp } from "./startApp";
import nodepath from "path";
import fs from "fs-extra";
import { LibraryPage } from "./pages/libraryPage";
import { SettingsPage } from "./pages/settingsPage";

test.describe.configure({ mode: "serial" });

const configFolderPath = nodepath.join(__dirname, "wrongRomsPathWindowsConfig");

let app: ElectronApplication;
let page: Page;
let libraryPage: LibraryPage;
let settingsPage: SettingsPage;

test.beforeAll(async () => {
  fs.rmSync(configFolderPath, { recursive: true, force: true });
  fs.copySync(nodepath.join(__dirname, "config"), configFolderPath);
  process.env.EMUZE_TEST_ROMS_PATH = "This path does not exist";
  process.env.EMUZE_TEST_EMULATORS_PATH = "This path does not exist";
  process.env.EMUZE_IS_WINDOWS = "true";
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

test("Should show settings on launch game", async () => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");
  await libraryPage.expectIsInitialSystem();
  await libraryPage.launchGameButton.click();

  await expect(settingsPage.generalPage.headline).toBeVisible();
  await expect(settingsPage.generalPage.romsPathNotExistError).toBeVisible();
  await expect(
    settingsPage.generalPage.emulatorsPathNotExistError,
  ).toBeVisible();

  await settingsPage.closeSettingsViaClick();
});

test("Should show settings on Import games", async () => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");
  await libraryPage.expectIsInitialSystem();
  await libraryPage.importGamesButton.click();

  await expect(settingsPage.generalPage.headline).toBeVisible();
  await expect(settingsPage.generalPage.romsPathNotExistError).toBeVisible();
  await expect(
    settingsPage.generalPage.emulatorsPathNotExistError,
  ).toBeVisible();

  await settingsPage.closeSettingsViaClick();
});

test("Should show error on general page", async () => {
  await settingsPage.openSettingsViaClick();
  await expect(settingsPage.generalPage.romsPathNotExistError).toBeVisible();
  await expect(
    settingsPage.generalPage.emulatorsPathNotExistError,
  ).toBeVisible();

  await settingsPage.generalPage.importAllButton.click();
  await expect(settingsPage.generalPage.romsPathNotExistError).toBeVisible();
  await expect(
    settingsPage.generalPage.emulatorsPathNotExistError,
  ).toBeVisible();
  await expect(page).toHaveScreenshot();
});
