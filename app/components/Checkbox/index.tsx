import { IoIosCheckmark } from "react-icons/io";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { styled } from "~/stitches";
import React from "react";

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: "unset",
  backgroundColor: "$sidebarBackgroundColor",
  borderStyle: "solid",
  borderWidth: "$1",
  borderColor: "$backgroundColor",
  borderRadius: 4,
  width: 25,
  height: 25,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:focus": {
    borderColor: "$color",
  },
});

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  color: "$color",
  width: "100%",
  height: "100%",
});

const Checkmark = styled(IoIosCheckmark, {
  width: "100%",
  height: "100%",
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
