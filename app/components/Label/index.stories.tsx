import { Label } from ".";
import { TextInput } from "../TextInput";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <>
        firstname
        <TextInput.Input name="firstname" />
      </>
    ),
  },
};
