import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { FormRow } from ".";
import { Label } from "../Label";
import { TextInput } from "../TextInput";

export default {
  title: "Components/FormRow",
  component: FormRow,
} as ComponentMeta<typeof FormRow>;

const Template: ComponentStory<typeof FormRow> = (args) => (
  <div style={{ width: "300px" }}>
    <FormRow {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <>
      <Label htmlFor="firstname">firstname</Label>
      <TextInput.Input name="firstname" id="firstname" />
    </>
  ),
};
