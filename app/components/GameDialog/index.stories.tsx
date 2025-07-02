import type { Meta, StoryObj } from "@storybook/react-vite";

import { GameDialog } from "./index.js";
import { Checkbox } from "../Checkbox/index.js";
import { Label } from "../Label/index.js";

const meta = {
  component: GameDialog,
} satisfies Meta<typeof GameDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        hello
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={true}
        />
        <Label htmlFor="alwaysGameNames">Always show game names</Label>
      </>
    ),
    onClose: () => {
      console.log("closed");
    },
  },
};
