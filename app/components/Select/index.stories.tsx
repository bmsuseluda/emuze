import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Select } from ".";

export default {
  title: "Components/Select",
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <>
      <option value="light">light</option>
      <option value="dark">dark</option>
    </>
  ),
};
