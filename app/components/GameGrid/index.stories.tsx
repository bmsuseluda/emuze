import { GameGrid } from "./index.js";
import { games, gamesLastPlayed } from "./testData.js";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
    onBack: () => {
      alert("back");
    },
    onGameClick: () => {
      alert("game click");
    },
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
    onBack: () => {
      alert("back");
    },
    onGameClick: () => {
      alert("game click");
    },
  },
};

export const LastPlayed: Story = {
  args: {
    games: gamesLastPlayed,
    onExecute: () => {
      console.log("launch");
    },
    isInFocus: true,
    onBack: () => {
      console.log("back");
    },
    onGameClick: () => {
      console.log("game click");
    },
  },
};
