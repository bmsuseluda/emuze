import { SidebarMainLayout } from ".";

import type { Meta, StoryObj } from "@storybook/react";
import { PlatformIcon } from "~/components/PlatformIcon";
import { styled } from "../../../../styled-system/jsx";

const meta = {
  component: SidebarMainLayout,
} satisfies Meta<typeof SidebarMainLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = styled("div", {
  base: {
    height: "100vh",
    display: "flex",
    margin: "-2",
  },
});

export const Basic: Story = {
  render: (args) => (
    <Wrapper>
      <SidebarMainLayout {...args} />
    </Wrapper>
  ),
  args: {
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
  },
};

export const WithHeader: Story = {
  render: (args) => (
    <Wrapper>
      <SidebarMainLayout {...args} />
    </Wrapper>
  ),
  args: {
    children: (
      <>
        <SidebarMainLayout.Sidebar headline="Categories" header="emuze">
          <a href="/">hello</a>
          <a href="/">hello</a>
          <a href="/">hello</a>
        </SidebarMainLayout.Sidebar>
        <SidebarMainLayout.Main>This is the main</SidebarMainLayout.Main>
      </>
    ),
  },
};

export const ManyElements: Story = {
  render: (args) => (
    <Wrapper>
      <SidebarMainLayout {...args} />
    </Wrapper>
  ),
  args: {
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
  },
};

export const WithSidebarCollapsed: Story = {
  render: (args) => (
    <Wrapper>
      <SidebarMainLayout {...args} />
    </Wrapper>
  ),
  args: {
    children: (
      <>
        <SidebarMainLayout.Sidebar headline="Categories" collapse>
          <PlatformIcon id="neogeo" />
          <PlatformIcon id="nintendogameboy" />
          <PlatformIcon id="sonyplaystation" />
        </SidebarMainLayout.Sidebar>
        <SidebarMainLayout.Main>This is the main</SidebarMainLayout.Main>
      </>
    ),
  },
};
