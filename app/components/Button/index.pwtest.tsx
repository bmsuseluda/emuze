import { expect, test } from "@playwright/experimental-ct-react";
import { Button } from ".";

test.use({ viewport: { width: 500, height: 500 } });

test("Should render the button", async ({ mount }) => {
  let executed = false;
  const onClick = () => {
    executed = true;
  };
  const component = await mount(<Button onClick={onClick}>click me</Button>);
  await expect(component).toContainText("click me");

  await component.click();
  expect(executed).toBeTruthy();
});

test("Should render the button disabled", async ({ mount }) => {
  const component = await mount(<Button disabled>click me</Button>);
  await expect(component).toBeDisabled();
});
