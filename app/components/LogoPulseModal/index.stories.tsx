import { LogoPulseModal } from ".";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: LogoPulseModal,
} satisfies Meta<typeof LogoPulseModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { active: true },
};
