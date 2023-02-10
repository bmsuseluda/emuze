import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { CheckboxRow } from ".";
import { Checkbox } from "~/components/Checkbox";
import { Label } from "~/components/Label";

export default {
  title: "Components/CheckboxRow",
  component: CheckboxRow,
} as ComponentMeta<typeof CheckboxRow>;

const Template: ComponentStory<typeof CheckboxRow> = (args) => (
  <CheckboxRow {...args} />
);

export const Checked = Template.bind({});
Checked.args = {
  children: (
    <>
      <Checkbox
        id="alwaysGameNames"
        name="alwaysGameNames"
        defaultChecked={true}
      />
      <Label htmlFor="alwaysGameNames">Always show game names</Label>
    </>
  ),
};

export const Unchecked = Template.bind({});
Unchecked.args = {
  children: (
    <>
      <Checkbox
        id="alwaysGameNames"
        name="alwaysGameNames"
        defaultChecked={false}
      />
      <Label htmlFor="alwaysGameNames">Always show game names</Label>
    </>
  ),
};
