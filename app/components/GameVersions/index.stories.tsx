import { GameVersions } from "./index.js";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { gameVersions } from "./testData.js";

const meta = {
  component: GameVersions,
} satisfies Meta<typeof GameVersions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    gameVersions,
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
