import { Select } from ".";
import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Select.Root,
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => {
    return (
      <Select.Root name="fruit" value="grapes">
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

export const Open: Story = {
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
