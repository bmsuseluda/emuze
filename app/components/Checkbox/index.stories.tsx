import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Checkbox } from ".";

export default {
  title: "Components/Checkbox",
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);

export const Basic = Template.bind({});

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
};
