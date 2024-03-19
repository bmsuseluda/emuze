import type { Meta, StoryObj } from "@storybook/react";

import { ErrorDialog } from ".";

const meta = {
  component: ErrorDialog,
} satisfies Meta<typeof ErrorDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "There was a big Error",
    stacktrace: "Hello \n next line",
    onClose: () => {},
  },
};

// TODO: add story with large stacktrace with scrolling

export const UnknownError: Story = {
  args: {
    onClose: () => {},
  },
};
