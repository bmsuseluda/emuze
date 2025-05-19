import { Headline } from "./index.js";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Headline,
} satisfies Meta<typeof Headline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "This is a big Headline",
  },
};
