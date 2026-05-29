import { FormRow } from "../../components/FormRow/index.js";
import { Checkbox } from "../../components/Checkbox/index.js";
import { CheckboxLabel } from "../../components/CheckboxLabel/index.js";
import type { ComponentProps } from "react";

export const CheckboxRow = ({
  "aria-label": ariaLabel,
  ...rest
}: ComponentProps<typeof Checkbox>) => (
  <FormRow>
    <CheckboxLabel>
      <Checkbox {...rest} />
      {ariaLabel}
    </CheckboxLabel>
  </FormRow>
);
