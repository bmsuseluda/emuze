import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TextInput } from ".";

export default {
  title: "Components/TextInput",
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => (
  <TextInput {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  name: "firstname",
  defaultValue: "Peter",
};
