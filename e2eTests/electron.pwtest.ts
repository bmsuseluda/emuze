import { ElectronApplication, expect, Page, test } from "@playwright/test";
import { startApp } from "./startApp";

test.describe.configure({ mode: "serial" });

let app: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  const response = await startApp();
  app = response.app;
  page = response.page;
});

test.afterAll(async () => {
  if (app) {
    await app.close();
  }
});

const switchToPlatformViaClick = async (
  page: Page,
  platformName: string,
  gameName?: string,
) => {
  const link = page.getByRole("link", {
    name: platformName,
  });
  await expect(link).toBeVisible();
  await expect(link).not.toBeFocused();
  await expect(
    page.getByRole("heading", { name: platformName }),
  ).not.toBeVisible();
  gameName &&
    (await expect(
      page.getByRole("radio", { name: gameName }),
    ).not.toBeVisible());

  await link.click();
  await expect(page.getByRole("heading", { name: platformName })).toBeVisible();
  await expect(link).toBeFocused();
  gameName &&
    (await expect(page.getByRole("radio", { name: gameName })).toBeVisible());
};

const returnToInitialPage = async (page: Page) => {
  await switchToPlatformViaClick(page, "Arcade");
};

test.skip("import all", async () => {
  await page.getByRole("button", { name: "Import all" }).click();
  await expect(page.getByRole("link", { name: "Playstation" })).toBeVisible();
});

test("Should show initial platform", async () => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");

  await expect(page).toHaveScreenshot();
});

test("Should switch to another platform via click", async () => {
  await switchToPlatformViaClick(
    page,
    "Sega Master System",
    "Sonic the Hedgehog",
  );

  await returnToInitialPage(page);
});

test("Should switch to another platform via key down", async () => {
  const arcadeLink = page.getByRole("link", {
    name: "Arcade",
  });
  await expect(arcadeLink).toBeVisible();
  await expect(arcadeLink).toBeFocused();
  await expect(page.getByRole("heading", { name: "Arcade" })).toBeVisible();

  await page.keyboard.press("ArrowDown");

  const gameBoyLink = page.getByRole("link", {
    name: "Game Boy",
  });
  await expect(page.getByRole("heading", { name: "Game Boy" })).toBeVisible();
  await expect(gameBoyLink).toBeFocused();
  await expect(
    page.getByRole("radio", { name: "Super Mario Land" }),
  ).toBeVisible();

  await returnToInitialPage(page);
});

test("Should open settings via mouse", async () => {
  const settingsHeadline = page.getByRole("heading", { name: "settings" });
  await expect(settingsHeadline).not.toBeVisible();

  await page.getByRole("link", { name: "settings" }).click();
  await expect(settingsHeadline).toBeVisible();
  await expect(page.getByRole("heading", { name: "General" })).toBeVisible();
  await expect(page.getByRole("link", { name: "General" })).toBeFocused();

  const arcadeLink = page.getByRole("link", {
    name: "Arcade",
  });
  await expect(arcadeLink).toBe;

  await expect(page).toHaveScreenshot();

  await page.getByRole("link", { name: "Appearance" }).click();
  await expect(page.getByRole("heading", { name: "Appearance" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Appearance" })).toBeFocused();

  await page.getByRole("button", { name: "close" }).click();
  await expect(settingsHeadline).not.toBeVisible();
});

test("Should open settings via keyboard", async () => {
  const settingsHeadline = page.getByRole("heading", { name: "settings" });
  await expect(settingsHeadline).not.toBeVisible();

  await page.keyboard.press("Escape");
  await expect(settingsHeadline).toBeVisible();
  await expect(page.getByRole("heading", { name: "General" })).toBeVisible();

  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("heading", { name: "Appearance" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(settingsHeadline).not.toBeVisible();
});

// TODO: use keyboard to go to grid and return
// TODO: no emulator for platform is installed
// TODO: import all with mocked api
// TODO: import for a platform with mocked api
// TODO: load more games
// TODO: start in fullscreen via command line
// TODO: test fullscreen setting
// TODO: test always show game name setting
// TODO: test collapse sidebar setting
// TODO: add offline test
// TODO: add steps
// TODO: add to pipeline
