import { Label } from "./index.js";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../Checkbox/index.js";

const meta = {
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  render: (args) => (
    <form>
      <Label {...args}>
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={true}
        />
        Always show game names
      </Label>
    </form>
  ),
};

export const Unchecked: Story = {
  render: (args) => (
    <form>
      <Label {...args}>
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={false}
        />
        Always show game names
      </Label>
    </form>
  ),
};
