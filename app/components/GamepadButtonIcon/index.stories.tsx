import type { Meta, StoryObj } from "@storybook/react";

import { GamepadButtonIcon } from ".";
import { layout } from "~/hooks/useGamepads/layouts";

const meta = {
  component: GamepadButtonIcon,
} satisfies Meta<typeof GamepadButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XboxA: Story = {
  args: {
    gamepadType: "XBox",
    buttonIndex: layout.buttons.A,
  },
};

export const NintendoB: Story = {
  args: {
    gamepadType: "Nintendo",
    buttonIndex: layout.buttons.A,
  },
};

export const PlayStationX: Story = {
  args: {
    gamepadType: "PlayStation",
    buttonIndex: layout.buttons.A,
  },
};
