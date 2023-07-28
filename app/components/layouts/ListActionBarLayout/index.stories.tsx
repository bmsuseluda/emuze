import { ListActionBarLayout } from ".";
import { Button } from "~/components/Button";
import { Label } from "~/components/Label";
import { TextInput } from "~/components/TextInput";

import type { Meta, StoryObj } from "@storybook/react";
import { styled } from "../../../../styled-system/jsx";

const meta = {
  component: ListActionBarLayout,
} satisfies Meta<typeof ListActionBarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = styled("div", {
  base: {
    height: "100vh",
    display: "flex",
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
