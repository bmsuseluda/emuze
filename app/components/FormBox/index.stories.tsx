import { FormBox } from ".";
import { Label } from "../Label";
import { TextInput } from "../TextInput";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: FormBox,
} satisfies Meta<typeof FormBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: "300px" }}>
      <FormBox {...args} />
    </div>
  ),
  args: {
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
  },
};
