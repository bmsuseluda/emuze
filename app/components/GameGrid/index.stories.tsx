import { GameGrid } from ".";
import { games } from "./testData";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: GameGrid,
} satisfies Meta<typeof GameGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    games,
    onExecute: () => {
      alert("launch");
    },
    isInFocus: true,
  },
};

export const WithAlwaysGameName: Story = {
  args: {
    games,
    alwaysGameNames: true,
    onExecute: () => {
      alert("launch");
    },
    isInFocus: true,
  },
};
