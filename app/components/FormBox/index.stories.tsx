import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { FormBox } from ".";
import { Label } from "../Label";
import { TextInput } from "../TextInput";

export default {
  title: "Components/FormBox",
  component: FormBox,
} as ComponentMeta<typeof FormBox>;

const Template: ComponentStory<typeof FormBox> = (args) => (
  <div style={{ width: "300px" }}>
    <FormBox {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <>
      <Label>
        firstname
        <TextInput.Input name="firstname" />
      </Label>
      <Label>
        lastname
        <TextInput.Input name="lastname" />
      </Label>
      <Label>
        address
        <TextInput.Input name="address" />
      </Label>
    </>
  ),
};
