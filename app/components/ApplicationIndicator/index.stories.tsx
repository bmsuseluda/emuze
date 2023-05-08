import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Button } from ".";
import { IoMdRefresh } from "react-icons/io";

export default {
  title: "Components/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: "save",
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: "save",
  disabled: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: "import",
  icon: <IoMdRefresh />,
};

export const Loading = Template.bind({});
Loading.args = {
  children: "loading",
  icon: <IoMdRefresh />,
  loading: true,
};
