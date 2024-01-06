import { Locator, Page } from "@playwright/test";

export class SettingsAppearancePage {
  readonly page: Page;
  readonly headline: Locator;
  readonly name = "Appearance";
  readonly fullscreen: Locator;
  readonly collapseSidebar: Locator;
  readonly allwaysShowGameNames: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headline = this.page.getByRole("heading", {
      name: this.name,
    });
    this.fullscreen = this.page.getByRole("checkbox", { name: "Fullscreen" });
    this.collapseSidebar = this.page.getByRole("checkbox", {
      name: "Collapse sidebar",
    });
    this.allwaysShowGameNames = this.page.getByRole("checkbox", {
      name: "Always show game names",
    });
    this.saveButton = this.page.getByRole("button", {
      name: "Save settings",
    });
  }
}
