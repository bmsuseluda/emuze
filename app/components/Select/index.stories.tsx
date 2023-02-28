import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { SelectDemo } from ".";
import React from "react";

export default {
  title: "Components/Select",
  component: SelectDemo,
} as ComponentMeta<typeof SelectDemo>;

export const Default: ComponentStoryObj<typeof SelectDemo> = {
  args: {},
  render: (args) => {
    return <SelectDemo />;
  },
};
