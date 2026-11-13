import { FormRow } from "../../components/FormRow/index.js";
import { Checkbox } from "../../components/Checkbox/index.js";
import { Label } from "../../components/Label/index.js";
import type { ComponentProps } from "react";

export const CheckboxRow = ({
  "aria-label": ariaLabel,
  ...rest
}: ComponentProps<typeof Checkbox>) => (
  <FormRow>
    <Label>
      {ariaLabel}
      <Checkbox {...rest} />
    </Label>
  </FormRow>
);
