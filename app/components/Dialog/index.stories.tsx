import type { Meta, StoryObj } from "@storybook/react";

import { Dialog } from ".";
import { Checkbox } from "~/components/Checkbox";
import { Label } from "~/components/Label";
import { useState } from "react";

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
        <Label htmlFor="alwaysGameNames">Always show game names</Label>
      </>
    ),
  },
};

const TriggerDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>open dialog</button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        hello
        <Checkbox
          id="alwaysGameNames"
          name="alwaysGameNames"
          defaultChecked={true}
        />
        <Label htmlFor="alwaysGameNames">Always show game names</Label>
      </Dialog>
    </>
  );
};

export const WithTriggerButton = {
  render: () => <TriggerDialog />,
};
