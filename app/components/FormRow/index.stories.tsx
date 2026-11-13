import { FormRow } from "./index.js";
import { TextInput } from "../TextInput/index.js";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: FormRow,
} satisfies Meta<typeof FormRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: "18.75rem" }}>
      <FormRow {...args} />
    </div>
  ),
  args: {
    children: (
      <>
        <label htmlFor="firstname">firstname</label>
        <TextInput.Input name="firstname" id="firstname" />
      </>
    ),
  },
};
