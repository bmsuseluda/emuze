import { icons, SettingsIcon } from "./index.js";

import type { Meta, StoryObj } from "@storybook/react";
import { styled } from "../../../styled-system/jsx/index.js";
import { IconChildrenWrapper } from "../IconChildrenWrapper/index.js";
import { Typography } from "../Typography/index.js";

const meta = {
  component: SettingsIcon,
} satisfies Meta<typeof SettingsIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = styled("div", {
  base: {
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  },
});

export const Default: Story = {
  args: {
    id: "general",
  },
  render: () => {
    const setingsIcons = Object.keys(icons).map((id) => (
      <IconChildrenWrapper key={id}>
        <SettingsIcon id={id as keyof typeof icons} />
        <Typography>{id}</Typography>
      </IconChildrenWrapper>
    ));

    return <Wrapper>{setingsIcons}</Wrapper>;
  },
};
