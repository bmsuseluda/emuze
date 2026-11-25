import { FormBox } from "./index.js";
import { TextInput } from "../TextInput/index.js";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: FormBox,
} satisfies Meta<typeof FormBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: "18.75rem" }}>
      <FormBox {...args} />
    </div>
  ),
  args: {
    children: (
      <>
        <label>
          firstname
          <TextInput.Input name="firstname" />
        </label>
        <label>
          lastname
          <TextInput.Input name="lastname" />
        </label>
        <label>
          address
          <TextInput.Input name="address" />
        </label>
      </>
    ),
  },
};
