import type { Meta, StoryObj } from "@storybook/react-vite";

import { Dialog } from "./index.js";
import { Checkbox } from "../Checkbox/index.js";
import { useState } from "react";
import { Button } from "../Button/index.js";

const meta = {
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    open: true,
    onClose: () => {},
    children: (
      <>
        hello
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={true}
        />
        <label htmlFor="alwaysGameNames">Always show game names</label>
      </>
    ),
  },
};

const TriggerDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>open dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        hello
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={true}
        />
        <label htmlFor="alwaysGameNames">Always show game names</label>
      </Dialog>
    </>
  );
};

export const WithTriggerButton = {
  render: () => <TriggerDialog />,
};
