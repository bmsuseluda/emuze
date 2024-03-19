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

const configFolderPath = nodepath.join(__dirname, "emptyWindowsConfig");
const testRomsPath = nodepath.join(__dirname, "testRoms");
const testEmulatorsPath = nodepath.join(__dirname, "testEmulators");

let app: ElectronApplication;
let page: Page;
let libraryPage: LibraryPage;
let settingsPage: SettingsPage;

test.beforeAll(async () => {
  fs.rmSync(configFolderPath, { recursive: true, force: true });
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

test("Should show initial config page", async () => {
  await settingsPage.expectIsInitialSubPage();
  await expect(settingsPage.closeButton).not.toBeVisible();
  await expect(settingsPage.generalPage.romsPath).toBeVisible();
  await expect(
    settingsPage.generalPage.romsPathRequiredError,
  ).not.toBeVisible();
  await expect(settingsPage.generalPage.emulatorsPath).toBeVisible();
  await expect(
    settingsPage.generalPage.emulatorsPathRequiredError,
  ).not.toBeVisible();

  await expect(page).toHaveScreenshot();

  await test.step("Should prevent from closing the overlay", async () => {
    await page.keyboard.press("Escape");

    await settingsPage.expectIsInitialSubPage();
  });

  await test.step("Should prevent from submitting without emulators path and roms path", async () => {
    await settingsPage.generalPage.importAllButton.click();
    await expect(settingsPage.generalPage.romsPathRequiredError).toBeVisible();
    await expect(
      settingsPage.generalPage.emulatorsPathRequiredError,
    ).toBeVisible();

    await expect(
      settingsPage.generalPage.page.getByRole("group", { name: "Roms Path" }),
    ).toHaveScreenshot();
    await expect(
      settingsPage.generalPage.page.getByRole("group", {
        name: "Emulators Path",
      }),
    ).toHaveScreenshot();
  });
});

test("Should import all", async () => {
  await settingsPage.generalPage.emulatorsPath.fill(testEmulatorsPath);
  await settingsPage.generalPage.romsPath.fill(testRomsPath);
  await settingsPage.generalPage.importAllButton.click();

  await expect(settingsPage.closeButton).toBeVisible();
  await settingsPage.closeSettingsViaClick();
  await libraryPage.expectIsInitialSystem();
  await expect(libraryPage.noInstalledEmulatorsButton).toBeVisible();
  await expect(page).toHaveScreenshot();

  await page.keyboard.press("ArrowDown");

  await libraryPage.expectIsSystem("Game Boy", "Super Mario Land");
  await expect(libraryPage.noInstalledEmulatorsButton).toBeVisible();
});
