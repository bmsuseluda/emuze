import { ElectronApplication, expect, Page, test } from "@playwright/test";
import { startApp } from "./startApp";
import nodepath from "path";
import fs from "fs";
import { LibraryPage } from "./pages/libraryPage";
import { SettingsPage } from "./pages/settingsPage";

test.describe.configure({ mode: "serial" });

const configFolderPath = nodepath.join(__dirname, "emptyWindowsConfig");
const testDataPath = nodepath.join(__dirname, "testData");
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
  await expect(page.getByRole("textbox", { name: "Roms Path" })).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Emulators Path" }),
  ).toBeVisible();

  await expect(page).toHaveScreenshot();

  await test.step("Should prevent from closing the overlay", async () => {
    await page.keyboard.press("Escape");

    await settingsPage.expectIsInitialSubPage();
  });

  await test.step("Should prevent from submitting without roms path", async () => {
    await page.getByRole("button", { name: "Import all" }).click();
    await expect(
      page.getByRole("textbox", { name: "Roms Path" }),
    ).toHaveScreenshot();
    await expect(
      page.getByRole("textbox", { name: "Emulators Path" }),
    ).toHaveScreenshot();

    // TODO: check of invalid state of input field
  });
});

test("Should import all", async () => {
  await page
    .getByRole("textbox", { name: "Emulators Path" })
    .fill(testEmulatorsPath);
  await page.getByRole("textbox", { name: "Roms Path" }).fill(testDataPath);
  await page.getByRole("button", { name: "Import all" }).click();

  await expect(settingsPage.closeButton).toBeVisible();
  await settingsPage.closeSettingsViaClick();
  await libraryPage.expectIsInitialPlatform();
  await expect(page).toHaveScreenshot();
});
