import type { Meta, StoryObj } from "@storybook/react-vite";
import { TbCancel } from "react-icons/tb";
import { RiShutDownLine } from "react-icons/ri";

import { ConfirmationDialog } from "./index.js";

const meta = {
  component: ConfirmationDialog,
} satisfies Meta<typeof ConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    open: true,
    headline: "Close emuze?",
    onDialogClose: () => {},
    cancelButtonDefinition: {
      onClick: () => {},
      icon: <TbCancel />,
      children: "Cancel",
    },
    confirmButtonDefinition: {
      onClick: () => {},
      icon: <RiShutDownLine />,
      children: "Close",
    },
    entryListRef: { current: null },
    entriesRefCallback: () => () => {},
  },
};
