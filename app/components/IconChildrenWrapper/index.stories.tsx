import { IconChildrenWrapper } from ".";
import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "~/components/Typography";
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
