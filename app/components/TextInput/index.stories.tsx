import type { ComponentMeta, ComponentStory } from "@storybook/react";

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
  children: (
    <>
      <TextInput.Input />
      <TextInput.IconButton>choose</TextInput.IconButton>
    </>
  ),
};

export const Invalid = Template.bind({});
Invalid.args = {
  children: (
    <>
      <TextInput.Input required />
      <TextInput.IconButton>choose</TextInput.IconButton>
    </>
  ),
};
