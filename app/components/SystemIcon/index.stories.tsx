import { icons, SystemIcon } from "./index.js";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { styled } from "../../../styled-system/jsx/index.js";
import { IconChildrenWrapper } from "../IconChildrenWrapper/index.js";
import { Typography } from "../Typography/index.js";

const meta = {
  component: SystemIcon,
} satisfies Meta<typeof SystemIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = styled("div", {
  base: {
    display: "flex",
    gap: "0.625rem",
    flexDirection: "column",
  },
});

export const Default: Story = {
  args: {
    id: "arcade",
  },
  render: () => {
    const systemIcons = Object.keys(icons).map((id) => (
      <IconChildrenWrapper iconSize="medium" key={id}>
        <SystemIcon id={id as keyof typeof icons} />
        <Typography>{id}</Typography>
      </IconChildrenWrapper>
    ));

    return <Wrapper>{systemIcons}</Wrapper>;
  },
};
