import { expect, test } from "../../pages/fixture";
import nodepath from "path";
import fs from "fs-extra";
import { configFolderPath, e2ePath, testName } from "./config";

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  fs.rmSync(configFolderPath, { recursive: true, force: true });
  fs.copySync(nodepath.join(e2ePath, "config"), configFolderPath);
  fs.copySync(
    nodepath.join(__dirname, "lastPlayed.json"),
    nodepath.join(configFolderPath, ".emuze", "data", "lastPlayed.json"),
  );
});

test.beforeEach(async ({ libraryPage }) => {
  await libraryPage.goto(testName);
});

test("Should show last played", async ({ page, libraryPage }) => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");
  await libraryPage.expectIsLastPlayed();

  await expect(page).toHaveScreenshot();
});

test("Should switch to another system via click", async ({ libraryPage }) => {
  await libraryPage.goToSystemViaClick(
    "Sega Master System",
    "Sonic the Hedgehog",
  );

  await libraryPage.goToLastPlayed();
});

test("Should switch to another system via key down", async ({
  libraryPage,
}) => {
  await libraryPage.expectIsLastPlayed();
  await libraryPage.press("ArrowDown");

  await libraryPage.expectIsInitialSystem();

  await libraryPage.goToLastPlayed();
});

test("Should open settings via keyboard", async ({
  libraryPage,
  settingsPage,
}) => {
  await settingsPage.openSettingsViaKeyboard();

  await libraryPage.press("ArrowDown");

  await settingsPage.expectIsSubPage(settingsPage.appearancePage.name);

  await libraryPage.press("ArrowRight");
  await expect(settingsPage.appearancePage.fullscreen).toBeFocused();

  await settingsPage.closeSettingsViaKeyboard();
});

test("Should check if focus history is valid after settings closed", async ({
  libraryPage,
}) => {
  await libraryPage.expectIsLastPlayed();

  await libraryPage.press("ArrowDown");

  await libraryPage.expectIsInitialSystem();
});

test("import all", async ({ page, libraryPage, settingsPage }) => {
  const playstationSystemName = "Playstation";
  const playstationLink = page.getByRole("link", {
    name: playstationSystemName,
  });

  await expect(playstationLink).not.toBeVisible();

  await libraryPage.expectIsLastPlayed();

  await settingsPage.openSettingsViaClick();
  await settingsPage.generalPage.importAllButton.click();
  await settingsPage.closeSettingsViaClick();

  await libraryPage.expectIsLastPlayed();
  await expect(playstationLink).toBeVisible();

  await libraryPage.goToSystemViaClick(playstationSystemName, "Gex");
});
