import { icons, PlatformIcon } from ".";

import type { Meta, StoryObj } from "@storybook/react";
import { styled } from "styled-system/jsx";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { Typography } from "~/components/Typography";

const meta = {
  component: PlatformIcon,
} satisfies Meta<typeof PlatformIcon>;

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
    id: "arcade",
  },
  render: () => {
    const platformIcons = Object.keys(icons).map((id) => (
      <IconChildrenWrapper key={id}>
        <PlatformIcon id={id as keyof typeof icons} />
        <Typography>{id}</Typography>
      </IconChildrenWrapper>
    ));

    return <Wrapper>{platformIcons}</Wrapper>;
  },
};
