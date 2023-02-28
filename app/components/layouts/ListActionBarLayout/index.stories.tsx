import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { ListActionBarLayout } from ".";
import { Button } from "~/components/Button";
import { Label } from "~/components/Label";
import { TextInput } from "~/components/TextInput";

export default {
  title: "Layouts/ListActionBarLayout",
  component: ListActionBarLayout,
} as ComponentMeta<typeof ListActionBarLayout>;

const Template: ComponentStory<typeof ListActionBarLayout> = (args) => (
  <ListActionBarLayout {...args} />
);

export const ManyElements = Template.bind({});
ManyElements.args = {
  headline: "Persons",
  children: (
    <>
      <form>
        <ListActionBarLayout.ListActionBarContainer
          list={
            <>
              <Label>
                firstname
                <TextInput name="firstname" />
              </Label>
              <Label>
                firstname
                <TextInput name="firstname" />
              </Label>
              <Label>
                firstname
                <TextInput name="firstname" />
              </Label>
              <Label>
                firstname
                <TextInput name="firstname" />
              </Label>
              <Label>
                firstname
                <TextInput name="firstname" />
              </Label>
              <Label>
                firstname
                <TextInput name="firstname" />
              </Label>
              <Label>
                firstname
                <TextInput name="firstname" />
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
};

export const OneElement = Template.bind({});
OneElement.args = {
  headline: "Persons",
  children: (
    <>
      <form>
        <ListActionBarLayout.ListActionBarContainer
          list={
            <>
              <Label>
                firstname
                <TextInput name="firstname" />
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
};

export const ZeroElement = Template.bind({});
ZeroElement.args = {
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
};
