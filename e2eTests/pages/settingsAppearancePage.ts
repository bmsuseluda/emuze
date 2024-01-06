import { Locator, Page } from "@playwright/test";

export class SettingsAppearancePage {
  readonly page: Page;
  readonly headline: Locator;
  readonly name = "Appearance";

  constructor(page: Page) {
    this.page = page;
    this.headline = this.page.getByRole("heading", {
      name: this.name,
    });
  }
}
