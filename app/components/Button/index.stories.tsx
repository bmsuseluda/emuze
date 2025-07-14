import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./index.js";
import { IoMdRefresh } from "react-icons/io";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "save",
  },
};

export const Disabled: Story = {
  args: {
    children: "save",
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: "import",
    icon: <IoMdRefresh />,
  },
};

export const Loading: Story = {
  args: {
    children: "loading",
    icon: <IoMdRefresh />,
    loading: true,
  },
};
