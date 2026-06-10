import type { Locator, Page } from "@playwright/test";

export class SettingsAdvancedPage {
  readonly page: Page;
  readonly headline: Locator;
  readonly name = "Advanced";
  readonly eden: Locator;
  readonly rmg: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headline = this.page.getByRole("heading", {
      name: this.name,
    });
    this.eden = this.page.getByRole("checkbox", {
      name: "Use Eden instead of Ryujinx to play Nintendo Switch",
    });
    this.rmg = this.page.getByRole("checkbox", {
      name: "Use RMG instead of ares to play Nintendo 64",
    });
    this.saveButton = this.page.getByRole("button", {
      name: "Save Settings",
    });
  }
}
