import { expect, type Locator, type Page } from "@playwright/test";

export class GameVersionsPage {
  readonly page: Page;
  readonly launchGameButton: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByRole("form", { name: "gameVersions" });
    this.launchGameButton = this.form.getByRole("button", {
      name: "Launch Game",
    });
  }

  async press(key: string) {
    await this.page.keyboard.press(key);
    await this.page.waitForTimeout(200);
  }

  async expectGameFocused(gameName: string) {
    await expect(
      this.form.getByRole("radio", { name: gameName }),
    ).toBeFocused();
  }

  async testGameVersionsPage() {
    await expect(this.form).toBeVisible();
    await expect(this.launchGameButton).toBeVisible();
    await expect(
      this.form.getByText("Super Mario Land (Modded)"),
    ).toBeVisible();
    await expect(this.form.getByText("Super Mario Land (USA)")).toBeVisible();
    await expect(
      this.form.getByText("Super Mario Land", { exact: true }),
    ).toBeVisible();

    await expect(this.page).toHaveScreenshot();

    await this.expectGameFocused("Super Mario Land (Modded)");
    await this.press("ArrowDown");
    await this.expectGameFocused("Super Mario Land (USA)");

    await this.press("Escape");
    await expect(this.form).not.toBeVisible();
  }
}
