import { SidebarMainLayout } from "./index.js";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { SystemIcon } from "../../SystemIcon/index.js";
import { styled } from "../../../../styled-system/jsx/index.js";

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
  render: (args) => (
    <Wrapper>
      <SidebarMainLayout {...args} />
    </Wrapper>
  ),
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
          <SystemIcon id="neogeo" />
          <SystemIcon id="nintendogameboy" />
          <SystemIcon id="sonyplaystation" />
        </SidebarMainLayout.Sidebar>
        <SidebarMainLayout.Main>This is the main</SidebarMainLayout.Main>
      </>
    ),
  },
};
