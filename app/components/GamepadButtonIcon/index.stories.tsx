import type { Meta, StoryObj } from "@storybook/react-vite";

import { GamepadButtonIcon } from "./index.js";
import { layout } from "../../hooks/useGamepads/layouts/index.js";
import { Button } from "../Button/index.js";

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
