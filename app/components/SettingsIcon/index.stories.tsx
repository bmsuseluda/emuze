import { icons, SettingsIcon } from ".";

import type { Meta, StoryObj } from "@storybook/react";
import { styled } from "../../../styled-system/jsx";
import { IconChildrenWrapper } from "../IconChildrenWrapper";
import { Typography } from "../Typography";

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
