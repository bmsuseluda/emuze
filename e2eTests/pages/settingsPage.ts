import { expect, type Locator, type Page } from "@playwright/test";
import { SettingsGeneralPage } from "./settingsGeneralPage";
import { SettingsAppearancePage } from "./settingsAppearancePage";

export class SettingsPage {
  readonly page: Page;
  readonly initialSubPage: string;
  readonly settingsHeadline: Locator;
  readonly closeButton: Locator;

  readonly generalPage: SettingsGeneralPage;
  readonly appearancePage: SettingsAppearancePage;

  constructor(page: Page) {
    this.page = page;
    this.settingsHeadline = this.page.getByRole("heading", {
      name: "settings",
    });
    this.closeButton = this.page.getByRole("button", { name: "Close Modal" });

    this.generalPage = new SettingsGeneralPage(page);
    this.appearancePage = new SettingsAppearancePage(page);
    this.initialSubPage = this.generalPage.name;
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
}
