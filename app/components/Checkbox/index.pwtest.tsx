import { expect, test } from "@playwright/experimental-ct-react";
import { Checkbox } from ".";

test.use({ viewport: { width: 500, height: 500 } });

test("Should render the checkbox", async ({ mount }) => {
  const component = await mount(
    <form>
      <Checkbox />
    </form>,
  );
  const checkbox = component.getByRole("checkbox");
  await expect(checkbox).toBeVisible();
  await expect(checkbox).not.toBeChecked();

  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toHaveScreenshot();
});
