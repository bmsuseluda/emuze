import { Checkbox } from "./index.js";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    checked: true,
  },
  render: (args) => (
    <form>
      <Checkbox {...args} />
    </form>
  ),
};

export const Unchecked: Story = {
  args: {},
  render: (args) => (
    <form>
      <Checkbox {...args} />
    </form>
  ),
};
