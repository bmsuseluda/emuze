import type { Meta, StoryObj } from "@storybook/react";

import { CloseDialog } from "./index.js";

const meta = {
  component: CloseDialog,
} satisfies Meta<typeof CloseDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    open: true,
    onClose: () => {},
    onCancel: () => {},
    entryListRef: { current: null },
    entriesRefCallback: () => () => {},
  },
};
