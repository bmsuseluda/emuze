import { TextInput } from "./index.js";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { FaFolderOpen } from "react-icons/fa";

const meta = {
  component: TextInput,
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <TextInput.Input defaultValue="This is a TextInput" iconButton />
        <TextInput.IconButton>
          <FaFolderOpen />
        </TextInput.IconButton>
      </>
    ),
  },
};

export const Invalid: Story = {
  args: {
    children: (
      <>
        <TextInput.Input iconButton />
        <TextInput.IconButton>
          <FaFolderOpen />
        </TextInput.IconButton>
      </>
    ),
    error: "This is a Error",
  },
};
