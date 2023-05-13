import { EntryList } from ".";
import { entries } from "./testData";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: EntryList,
} satisfies Meta<typeof EntryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    entries,
    onExecute: () => {
      alert("launch");
    },
    isInFocus: true,
  },
};

export const WithAlwaysGameName: Story = {
  args: {
    entries,
    alwaysGameNames: true,
    onExecute: () => {
      alert("launch");
    },
    isInFocus: true,
  },
};
