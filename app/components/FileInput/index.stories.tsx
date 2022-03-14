import { ComponentStory, ComponentMeta } from "@storybook/react";

import { FileInput } from ".";

export default {
  title: "Components/FileInput",
  component: FileInput,
} as ComponentMeta<typeof FileInput>;

const Template: ComponentStory<typeof FileInput> = (args) => (
  <div style={{ width: "300px" }}>
    <FileInput {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <>
      <FileInput.TextInput />
      <FileInput.Button>choose</FileInput.Button>
    </>
  ),
};

export const Invalid = Template.bind({});
Invalid.args = {
  children: (
    <>
      <FileInput.TextInput required />
      <FileInput.Button>choose</FileInput.Button>
    </>
  ),
};
