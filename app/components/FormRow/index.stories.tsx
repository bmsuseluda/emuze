import { FormRow } from ".";
import { Label } from "../Label";
import { TextInput } from "../TextInput";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: FormRow,
} satisfies Meta<typeof FormRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: "300px" }}>
      <FormRow {...args} />
    </div>
  ),
  args: {
    children: (
      <>
        <Label htmlFor="firstname">firstname</Label>
        <TextInput.Input name="firstname" id="firstname" />
      </>
    ),
  },
};
