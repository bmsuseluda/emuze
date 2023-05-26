import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationIndicator } from ".";
import { pcsx2, play } from "~/server/__testData__/applications";

const meta = {
  component: ApplicationIndicator,
} satisfies Meta<typeof ApplicationIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleInstalledApplications: Story = {
  args: {
    application: play,
    installedApplications: [play, pcsx2],
  },
};

export const NoInstalledApplication: Story = {
  args: {
    application: play,
    installedApplications: [],
  },
};

export const OnlyOneInstalledApplication: Story = {
  args: {
    application: play,
    installedApplications: [play],
  },
};
