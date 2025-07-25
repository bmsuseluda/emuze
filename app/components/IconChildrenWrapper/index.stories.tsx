import { IconChildrenWrapper } from "./index.js";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "../Typography/index.js";
import { IoMdRefresh } from "react-icons/io";

const meta = {
  component: IconChildrenWrapper,
} satisfies Meta<typeof IconChildrenWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <IoMdRefresh />
        <Typography>Im next to a icon</Typography>
      </>
    ),
  },
};

export const Rotate: Story = {
  args: {
    children: (
      <>
        <IoMdRefresh />
        <Typography>Im next to a icon</Typography>
      </>
    ),
    rotate: true,
  },
};
