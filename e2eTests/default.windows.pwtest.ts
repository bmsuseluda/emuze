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

const configFolderPath = nodepath.join(__dirname, "defaultWindowsConfig");
const testEmulatorsPath = nodepath.join(__dirname, "testEmulators");

let app: ElectronApplication;
let page: Page;
let libraryPage: LibraryPage;
let settingsPage: SettingsPage;

test.beforeAll(async () => {
  fs.rmSync(configFolderPath, { recursive: true, force: true });
  fs.copySync(nodepath.join(__dirname, "config"), configFolderPath);
  process.env.EMUZE_TEST_ROMS_PATH = nodepath.join(__dirname, "testRoms");
  process.env.EMUZE_TEST_EMULATORS_PATH = testEmulatorsPath;
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

test("Should show initial system", async () => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");
  await libraryPage.expectIsInitialSystem();

  await expect(page).toHaveScreenshot();
});

test("Should switch to another system via click", async () => {
  await libraryPage.goToSystemViaClick(
    "Sega Master System",
    "Sonic the Hedgehog",
  );

  await libraryPage.gotToInitialSystem();
});

test("Should switch to another system via key down", async () => {
  await libraryPage.expectIsInitialSystem();

  await page.keyboard.press("ArrowDown");

  await libraryPage.expectIsSystem("Game Boy", "Super Mario Land");

  await libraryPage.gotToInitialSystem();
});

test("Should open settings via mouse", async () => {
  await settingsPage.openSettingsViaClick();
  await expect(
    settingsPage.generalPage.installEmulatorsButton,
  ).not.toBeVisible();

  await expect(page).toHaveScreenshot();

  await settingsPage.goToSubPageViaClick(settingsPage.appearancePage.name);

  await settingsPage.closeSettingsViaClick();
});

test("Should open settings via keyboard and activate appearance options", async () => {
  await settingsPage.openSettingsViaKeyboard();

  await page.keyboard.press("ArrowDown");

  await settingsPage.expectIsSubPage(settingsPage.appearancePage.name);

  await page.keyboard.press("ArrowRight");
  await expect(settingsPage.appearancePage.fullscreen).toBeFocused();
  await page.keyboard.press("Enter");

  await page.keyboard.press("ArrowDown");
  await expect(settingsPage.appearancePage.allwaysShowGameNames).toBeFocused();
  await page.keyboard.press("Enter");

  await page.keyboard.press("ArrowDown");
  await expect(settingsPage.appearancePage.collapseSidebar).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveScreenshot();

  await page.keyboard.press("s");

  await settingsPage.closeSettingsViaKeyboard(true);

  await expect(page).toHaveScreenshot();
});

test("Should check if focus history is valid after settings closed", async () => {
  await libraryPage.expectIsInitialSystem();

  await page.keyboard.press("ArrowDown");

  await libraryPage.expectIsSystem("Game Boy", "Super Mario Land");
});

test("import all", async () => {
  const playstationSystemName = "Playstation";
  const playstationLink = page.getByRole("link", {
    name: playstationSystemName,
  });

  await expect(playstationLink).not.toBeVisible();

  await settingsPage.openSettingsViaClick(true);
  await settingsPage.generalPage.importAllButton.click();
  await settingsPage.closeSettingsViaClick(true);

  await libraryPage.goToSystemViaClick(playstationSystemName, "Gex");
});
