import { CheckboxRow } from ".";
import { Checkbox } from "~/components/Checkbox";
import { Label } from "~/components/Label";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: CheckboxRow,
} satisfies Meta<typeof CheckboxRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    children: (
      <>
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={true}
        />
        <Label htmlFor="alwaysGameNames">Always show game names</Label>
      </>
    ),
  },
};

export const Unchecked: Story = {
  args: {
    children: (
      <>
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={false}
        />
        <Label htmlFor="alwaysGameNames">Always show game names</Label>
      </>
    ),
  },
};
