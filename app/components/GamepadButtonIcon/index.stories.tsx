import type { Meta, StoryObj } from "@storybook/react-vite";

import { GamepadButtonIcon } from "./index.js";
import { Button } from "../Button/index.js";

const meta = {
  component: GamepadButtonIcon,
} satisfies Meta<typeof GamepadButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XboxA: Story = {
  args: {
    gamepadType: "XBox",
    buttonId: "a",
  },
  render: (args) => <Button icon={<GamepadButtonIcon {...args} />}></Button>,
};

export const NintendoB: Story = {
  args: {
    gamepadType: "Nintendo",
    buttonId: "a",
  },
  render: (args) => <Button icon={<GamepadButtonIcon {...args} />}></Button>,
};

export const PlayStationX: Story = {
  args: {
    gamepadType: "PlayStation",
    buttonId: "a",
  },
  render: (args) => <Button icon={<GamepadButtonIcon {...args} />}></Button>,
};
