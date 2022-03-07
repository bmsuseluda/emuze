import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SidebarMainLayout } from ".";

export default {
  title: "Layouts/SidebarMainLayout",
  component: SidebarMainLayout,
} as ComponentMeta<typeof SidebarMainLayout>;

const Template: ComponentStory<typeof SidebarMainLayout> = (args) => (
  <SidebarMainLayout {...args} css={{ margin: "-$2" }} />
);

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <>
      <SidebarMainLayout.Sidebar headline="Categories">
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
      </SidebarMainLayout.Sidebar>
      <SidebarMainLayout.Main>This is the main</SidebarMainLayout.Main>
    </>
  ),
};

export const ManyElements = Template.bind({});
ManyElements.args = {
  children: (
    <>
      <SidebarMainLayout.Sidebar headline="Categories">
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
        <a href="/">hello</a>
      </SidebarMainLayout.Sidebar>
      <SidebarMainLayout.Main>This is the main</SidebarMainLayout.Main>
    </>
  ),
};
