import { expect, type Locator, type Page } from "@playwright/test";
import { SettingsGeneralPage } from "./settingsGeneralPage";
import { SettingsAppearancePage } from "./settingsAppearancePage";
import { SettingsAboutPage } from "./settingsAboutPage";

export class SettingsPage {
  readonly page: Page;
  readonly initialSubPage: string;
  readonly settingsHeadline: Locator;
  readonly closeButton: Locator;

  readonly generalPage: SettingsGeneralPage;
  readonly appearancePage: SettingsAppearancePage;
  readonly aboutPage: SettingsAboutPage;

  constructor(page: Page) {
    this.page = page;
    this.settingsHeadline = this.page.getByRole("heading", {
      name: "settings",
    });
    this.closeButton = this.page.getByRole("button", { name: "Close Modal" });

    this.generalPage = new SettingsGeneralPage(page);
    this.appearancePage = new SettingsAppearancePage(page);
    this.aboutPage = new SettingsAboutPage(page);
    this.initialSubPage = this.generalPage.name;
  }

  async press(key: string) {
    await this.page.keyboard.press(key);
    await this.page.waitForTimeout(200);
  }

  async openSettingsViaClick(collapse?: boolean) {
    await expect(this.settingsHeadline).not.toBeVisible();
    await this.page.getByRole("link", { name: "settings" }).click();
    if (!collapse) {
      await expect(this.settingsHeadline).toBeVisible();
    }

    await this.expectIsInitialSubPage(collapse);
  }

  async openSettingsViaKeyboard(collapse?: boolean) {
    await expect(this.settingsHeadline).not.toBeVisible();
    await this.page.keyboard.press("Escape");
    if (!collapse) {
      await expect(this.settingsHeadline).toBeVisible();
    }

    await this.expectIsInitialSubPage(collapse);
  }

  async closeSettingsViaClick(collapse?: boolean) {
    if (!collapse) {
      await expect(this.settingsHeadline).toBeVisible();
    }
    await this.closeButton.click();
    await expect(this.settingsHeadline).not.toBeVisible();
  }

  async closeSettingsViaKeyboard(collapse?: boolean) {
    if (!collapse) {
      await expect(this.settingsHeadline).toBeVisible();
    }
    await this.page.keyboard.press("Escape");
    await expect(this.settingsHeadline).not.toBeVisible();
  }

  async goToSubPageViaClick(subPageName: string) {
    const link = this.page.getByRole("link", {
      name: subPageName,
    });
    await expect(link).toBeVisible();
    await expect(link).not.toBeFocused();
    await expect(
      this.page.getByRole("heading", { name: subPageName }),
    ).not.toBeVisible();

    await link.click();

    await this.expectIsSubPage(subPageName);
  }

  async expectIsSubPage(subPageName: string) {
    const link = this.page.getByRole("link", {
      name: subPageName,
    });
    await expect(
      this.page.getByRole("heading", { name: subPageName }),
    ).toBeVisible();
    // TODO: replace with is marked red
    // await expect(link).toBeFocused();
  }

  async expectIsInitialSubPage(collapse?: boolean) {
    if (!collapse) {
      await expect(this.settingsHeadline).toBeVisible();
    }
    await this.expectIsSubPage(this.initialSubPage);
  }

  async openSettingsAndActivateAppearanceSettings() {
    await this.openSettingsViaKeyboard();

    await this.press("ArrowDown");

    await this.expectIsSubPage(this.appearancePage.name);

    await this.press("ArrowRight");
    await expect(this.appearancePage.fullscreen).toBeFocused();

    await expect(this.page).toHaveScreenshot();

    await this.press("ArrowDown");
    await expect(this.appearancePage.allwaysShowGameNames).toBeFocused();
    await this.press("Enter");
    await expect(this.appearancePage.allwaysShowGameNames).toBeChecked();

    await this.press("ArrowDown");
    await expect(this.appearancePage.collapseSidebar).toBeFocused();
    await this.appearancePage.collapseSidebar.press("Enter");
    await expect(this.appearancePage.collapseSidebar).toBeChecked();

    await expect(this.page).toHaveScreenshot();

    await this.press("Backspace");
    await this.closeSettingsViaKeyboard(true);

    await expect(this.page).toHaveScreenshot();
  }
}
