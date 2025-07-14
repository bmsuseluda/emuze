import { CheckboxLabel } from "./index.js";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../Checkbox/index.js";

const meta = {
  component: CheckboxLabel,
} satisfies Meta<typeof CheckboxLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  render: (args) => (
    <form>
      <CheckboxLabel {...args}>
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={true}
        />
        Always show game names
      </CheckboxLabel>
    </form>
  ),
};

export const Unchecked: Story = {
  render: (args) => (
    <form>
      <CheckboxLabel {...args}>
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={false}
        />
        Always show game names
      </CheckboxLabel>
    </form>
  ),
};
