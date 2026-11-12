import { OptionList } from "./index.js";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { gameVersions } from "./testData.js";

const meta = {
  component: OptionList,
} satisfies Meta<typeof OptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    options: gameVersions,
    groupName: "gameVersion",
    onConfirmation: () => {
      alert("launch");
    },
    isInFocus: true,
    onBack: () => {
      alert("back");
    },
    onOptionClick: () => {
      alert("game click");
    },
  },
};
