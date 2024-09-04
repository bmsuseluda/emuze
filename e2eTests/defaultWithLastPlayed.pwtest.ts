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

const configFolderPath = nodepath.join(
  __dirname,
  "defaultWithLastPlayedConfig",
);

let app: ElectronApplication;
let page: Page;
let libraryPage: LibraryPage;
let settingsPage: SettingsPage;

test.beforeAll(async () => {
  fs.rmSync(configFolderPath, { recursive: true, force: true });
  fs.copySync(nodepath.join(__dirname, "config"), configFolderPath);
  fs.copySync(
    nodepath.join(__dirname, "lastPlayed.json"),
    nodepath.join(configFolderPath, ".emuze", "data", "lastPlayed.json"),
  );
  process.env.EMUZE_TEST_ROMS_PATH = nodepath.join(__dirname, "testRoms");
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

test("Should show last played", async () => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");
  await libraryPage.expectIsLastPlayed();

  await expect(page).toHaveScreenshot();
});

test("Should switch to another system via click", async () => {
  await libraryPage.goToSystemViaClick(
    "Sega Master System",
    "Sonic the Hedgehog",
  );

  await libraryPage.goToLastPlayed();
});

test("Should switch to another system via key down", async () => {
  await libraryPage.expectIsLastPlayed();
  await page.keyboard.press("ArrowDown");

  await libraryPage.expectIsInitialSystem();

  await libraryPage.goToLastPlayed();
});

test("Should open settings via keyboard", async () => {
  await settingsPage.openSettingsViaKeyboard();

  await page.keyboard.press("ArrowDown");

  await settingsPage.expectIsSubPage(settingsPage.appearancePage.name);

  await page.keyboard.press("ArrowRight");
  await expect(settingsPage.appearancePage.fullscreen).toBeFocused();

  await settingsPage.closeSettingsViaKeyboard();
});

test("Should check if focus history is valid after settings closed", async () => {
  await libraryPage.expectIsLastPlayed();

  await page.keyboard.press("ArrowDown");

  await libraryPage.expectIsInitialSystem();
});

test("import all", async () => {
  const playstationSystemName = "Playstation";
  const playstationLink = page.getByRole("link", {
    name: playstationSystemName,
  });

  await expect(playstationLink).not.toBeVisible();

  await libraryPage.goToLastPlayed();

  await settingsPage.openSettingsViaClick();
  await settingsPage.generalPage.importAllButton.click();
  await settingsPage.closeSettingsViaClick();

  await libraryPage.expectIsLastPlayed();
  await expect(playstationLink).toBeVisible();

  await libraryPage.goToSystemViaClick(playstationSystemName, "Gex");
});
