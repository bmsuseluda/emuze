import { TextInput } from ".";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: TextInput,
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <TextInput.Input defaultValue="This is a TextInput" />
        <TextInput.IconButton>choose</TextInput.IconButton>
      </>
    ),
  },
};

export const Invalid: Story = {
  args: {
    children: (
      <>
        <TextInput.Input required />
        <TextInput.IconButton>choose</TextInput.IconButton>
      </>
    ),
  },
};
