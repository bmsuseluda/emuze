import { GiCheckMark } from "react-icons/gi";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { styled } from "~/stitches";
import React from "react";

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: "unset",
  backgroundColor: "$backgroundColor",
  borderStyle: "solid",
  borderWidth: "$2",
  borderColor: "$accent",
  borderRadius: 4,
  width: 25,
  height: 25,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  // "&:focus": {
  //   borderColor: "$color",
  // },

  "&:hover": {
    cursor: "pointer",
  },
});

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  color: "$color",
  width: "100%",
  height: "100%",
  padding: "2px",
  backgroundColor: "$accent",
  boxSizing: "border-box",
});

const Checkmark = styled(GiCheckMark, {
  width: "100%",
  height: "100%",
  color: "$backgroundColor",
});

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>((props, forwardedRef) => (
  <StyledCheckbox {...props} ref={forwardedRef}>
    <StyledIndicator>
      <Checkmark />
    </StyledIndicator>
  </StyledCheckbox>
));

Checkbox.displayName = "Checkbox";
