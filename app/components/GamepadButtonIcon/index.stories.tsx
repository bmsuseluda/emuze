import type { Meta, StoryObj } from "@storybook/react";

import { GamepadButtonIcon } from ".";
import { layout } from "~/hooks/useGamepads/layouts";
import { Button } from "~/components/Button";

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
  render: (args) => <Button icon={<GamepadButtonIcon {...args} />}></Button>,
};

export const NintendoB: Story = {
  args: {
    gamepadType: "Nintendo",
    buttonIndex: layout.buttons.A,
  },
  render: (args) => <Button icon={<GamepadButtonIcon {...args} />}></Button>,
};

export const PlayStationX: Story = {
  args: {
    gamepadType: "PlayStation",
    buttonIndex: layout.buttons.A,
  },
  render: (args) => <Button icon={<GamepadButtonIcon {...args} />}></Button>,
};
