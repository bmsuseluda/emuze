import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { ApplicationIndicator } from ".";
import { duckstation } from "~/server/__testData__/applications";

export default {
  title: "Components/ApplicationIndicator",
  component: ApplicationIndicator,
} as ComponentMeta<typeof ApplicationIndicator>;

const Template: ComponentStory<typeof ApplicationIndicator> = (args) => (
  <ApplicationIndicator {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  application: duckstation,
};
