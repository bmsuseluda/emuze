import { GiCheckMark } from "react-icons/gi";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import React from "react";
import { styled } from "../../../styled-system/jsx";

const Wrapper = styled("div", {
  base: {
    backgroundColor: "backgroundColor",
    borderWidth: "2px",
    borderRadius: 4,
    borderColor: "accent",
    outline: "none",
    width: 2,
    height: 2,
    "&:hover": {
      cursor: "pointer",
    },

    "&:has(*:checked)": {
      backgroundColor: "accent",
    },
  },
});

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    outline: "none",
  },
});

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  base: {
    color: "color",
    width: "100%",
    height: "100%",
    padding: "2px",
    boxSizing: "border-box",
  },
});

const Checkmark = styled(GiCheckMark, {
  base: { width: "100%", height: "100%", color: "backgroundColor" },
});

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>((props, forwardedRef) => (
  <Wrapper>
    <StyledCheckbox {...props} ref={forwardedRef}>
      <StyledIndicator>
        <Checkmark />
      </StyledIndicator>
    </StyledCheckbox>
  </Wrapper>
));

Checkbox.displayName = "Checkbox";
