import { ElectronApplication, expect, Page, test } from "@playwright/test";
import { startApp } from "./startApp";
import nodepath from "path";
import fs from "fs-extra";
import { LibraryPage } from "./pages/libraryPage";
import { SettingsPage } from "./pages/settingsPage";

test.describe.configure({ mode: "serial" });

const configFolderPath = nodepath.join(__dirname, "defaultWindowsConfig");

let app: ElectronApplication;
let page: Page;
let libraryPage: LibraryPage;
let settingsPage: SettingsPage;

test.beforeAll(async () => {
  fs.rmSync(configFolderPath, { recursive: true, force: true });
  fs.copySync(nodepath.join(__dirname, "config"), configFolderPath);
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

test("Should show initial platform", async () => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");
  await libraryPage.expectIsInitialPlatform();

  await expect(page).toHaveScreenshot();
});

test("Should switch to another platform via click", async () => {
  await libraryPage.goToToPlatformViaClick(
    "Sega Master System",
    "Sonic the Hedgehog",
  );

  await libraryPage.gotToInitialPlatform();
});

test("Should switch to another platform via key down", async () => {
  await libraryPage.expectIsInitialPlatform();

  await page.keyboard.press("ArrowDown");

  await libraryPage.expectIsPlatform("Game Boy", "Super Mario Land");

  await libraryPage.gotToInitialPlatform();
});

test("Should open settings via mouse", async () => {
  await settingsPage.openSettingsViaClick();

  await expect(page).toHaveScreenshot();

  await settingsPage.goToToSubPageViaClick(settingsPage.appearancePage.name);

  await settingsPage.closeSettingsViaClick();
});

test("Should open settings via keyboard", async () => {
  await settingsPage.openSettingsViaKeyboard();

  await page.keyboard.press("ArrowDown");

  await settingsPage.expectIsSubPage(settingsPage.appearancePage.name);

  await settingsPage.closeSettingsViaKeyboard();
});

test("import all", async () => {
  const playstationPlatformName = "Playstation";
  const playstationLink = page.getByRole("link", {
    name: playstationPlatformName,
  });

  await expect(playstationLink).not.toBeVisible();

  await libraryPage.importAllButton.click();

  await libraryPage.goToToPlatformViaClick(playstationPlatformName, "Gex");
});

// TODO: use keyboard to go to grid and return
// TODO: no emulator for platform is installed
// TODO: import for a platform with mocked api
// TODO: load more games
// TODO: start in fullscreen via command line
// TODO: test fullscreen setting
// TODO: test always show game name setting
// TODO: test collapse sidebar setting
// TODO: add offline test
// TODO: add steps
// TODO: add windows specific tests with docker image
// TODO: test against the remix app and only against electron for specific electron features
