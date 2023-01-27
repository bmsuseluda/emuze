import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { EntryList } from ".";
import { entries } from "./testData";

export default {
  title: "Components/EntryList",
  component: EntryList,
} as ComponentMeta<typeof EntryList>;

const Template: ComponentStory<typeof EntryList> = (args) => (
  <EntryList {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  entries,
  entriesRefs: { current: [] },
  onDoubleClick: () => {
    alert("launch");
  },
};
