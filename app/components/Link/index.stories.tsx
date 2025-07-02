import type { Meta, StoryObj } from "@storybook/react-vite";

import { Link } from "./index.js";
import { FaGithub } from "react-icons/fa";

const meta = {
  component: Link,
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "GitHub",
    icon: FaGithub,
  },
};
