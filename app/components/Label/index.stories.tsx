import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Label } from ".";
import { TextInput } from "../TextInput";

export default {
  title: "Components/Label",
  component: Label,
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <>
      firstname
      <TextInput name="firstname" />
    </>
  ),
};
