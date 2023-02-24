import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Dialog } from ".";
import { Checkbox } from "~/components/Checkbox";
import { Label } from "~/components/Label";
import { useState } from "react";

export default {
  title: "Components/Dialog",
  component: Dialog,
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = (args) => <Dialog {...args} />;

export const Basic = Template.bind({});
Basic.args = {
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
