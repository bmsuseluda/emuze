import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Select } from ".";
import React from "react";

export default {
  title: "Components/Select",
  component: Select.Root,
} as ComponentMeta<typeof Select.Root>;

export const Default: ComponentStoryObj<typeof Select.Root> = {
  args: {},
  render: (args) => {
    return (
      <Select.Root>
        <Select.Trigger placeholder="Select a fruit…"></Select.Trigger>
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="blueberry">Blueberry</Select.Item>
          <Select.Item value="grapes">Grapes</Select.Item>
          <Select.Item value="pineapple">Pineapple</Select.Item>
        </Select.Content>
      </Select.Root>
    );
  },
};

export const Open: ComponentStoryObj<typeof Select.Root> = {
  args: {},
  render: (args) => {
    return (
      <Select.Root open>
        <Select.Trigger placeholder="Select a fruit…"></Select.Trigger>
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="blueberry">Blueberry</Select.Item>
          <Select.Item value="grapes">Grapes</Select.Item>
          <Select.Item value="pineapple">Pineapple</Select.Item>
        </Select.Content>
      </Select.Root>
    );
  },
};
