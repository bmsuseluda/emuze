import { ListActionBarLayout } from "./index.js";
import { Button } from "../../Button/index.js";
import { Label } from "../../Label/index.js";
import { TextInput } from "../../TextInput/index.js";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { styled } from "../../../../styled-system/jsx/index.js";

const meta = {
  component: ListActionBarLayout,
} satisfies Meta<typeof ListActionBarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = styled("div", {
  base: {
    height: "100vh",
    display: "flex",
    margin: "-2rem 0",
  },
});

export const ManyElements: Story = {
  render: (args) => (
    <Wrapper>
      <ListActionBarLayout {...args} />
    </Wrapper>
  ),
  args: {
    headline: "Persons",
    children: (
      <>
        <form>
          <ListActionBarLayout.ListActionBarContainer
            list={
              <>
                <Label>
                  firstname
                  <TextInput.Input name="firstname" />
                </Label>
                <Label>
                  firstname
                  <TextInput.Input name="firstname" />
                </Label>
                <Label>
                  firstname
                  <TextInput.Input name="firstname" />
                </Label>
                <Label>
                  firstname
                  <TextInput.Input name="firstname" />
                </Label>
                <Label>
                  firstname
                  <TextInput.Input name="firstname" />
                </Label>
                <Label>
                  firstname
                  <TextInput.Input name="firstname" />
                </Label>
                <Label>
                  firstname
                  <TextInput.Input name="firstname" />
                </Label>
              </>
            }
            actions={
              <>
                <Button>Edit</Button>
                <Button>Create</Button>
              </>
            }
          />
        </form>
      </>
    ),
  },
};

export const OneElement: Story = {
  render: (args) => (
    <Wrapper>
      <ListActionBarLayout {...args} />
    </Wrapper>
  ),
  args: {
    headline: "Persons",
    children: (
      <>
        <form>
          <ListActionBarLayout.ListActionBarContainer
            list={
              <>
                <Label>
                  firstname
                  <TextInput.Input name="firstname" />
                </Label>
              </>
            }
            actions={
              <>
                <Button>Edit</Button>
                <Button>Create</Button>
              </>
            }
          />
        </form>
      </>
    ),
  },
};

export const ZeroElement: Story = {
  render: (args) => (
    <Wrapper>
      <ListActionBarLayout {...args} />
    </Wrapper>
  ),
  args: {
    headline: "Persons",
    children: (
      <>
        <form>
          <ListActionBarLayout.ListActionBarContainer
            list={<></>}
            actions={
              <>
                <Button>Edit</Button>
                <Button>Create</Button>
              </>
            }
          />
        </form>
      </>
    ),
  },
};
