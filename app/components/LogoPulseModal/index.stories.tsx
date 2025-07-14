import { LogoPulseModal } from "./index.js";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: LogoPulseModal,
} satisfies Meta<typeof LogoPulseModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { active: true },
};
